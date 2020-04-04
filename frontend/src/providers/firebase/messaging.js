import 'firebase/messaging';
import * as api from '@/api'

let initialized = false;

let _store;
const getStore = async () => {
  if (!_store) {
    _store = await import('@/store').then((store) => store.default);
  }
  return _store;
};

const persistPatientMessagingToken = async (messaging) => {
  console.log('Updating messaging token...');
  const token = await messaging.getToken();
  const store = await getStore();
  const loggedInPatient = store.getters['patients/getLoggedInPatient'];

  if (loggedInPatient) {
    console.log('Persisting messaging token...');
    await api.patients.setMessagingToken({ ticket: loggedInPatient.ticket, token });
    console.log('Messaging token persisted!');
  } else if (!initialized) {
    console.log('Watching for logged patients...');
    store.watch(
      function watchExpression(_state, getters) {
        return getters['patients/getLoggedInPatient'];
      },
      async function onChange(_oldValue, newValue) {
        if (!newValue) return;
        return persistPatientMessagingToken(messaging);
      },
    );
  }
};

const handleMessagingToken = async (messaging) => {
  try {
    await messaging.requestPermission();
    console.log('Permission granted for the messaging service!');
    await persistPatientMessagingToken(messaging);
    initialized = true;
  } catch (err) {
    console.error('Unable to get messaging token', err);
  }
};

const onMessage = (messaging) => (callback) => new Promise((resolve, reject) => {
  let timesVerified = 0;
  const interval = setInterval(() => {
    console.log('ai');
    if (!initialized) {
      timesVerified += 1;
      if (timesVerified > 60) {
        clearInterval(interval);
        reject(new Error('Timed out waiting for messaging lib to initialize'));
      }
      return;
    }
    clearInterval(interval);
    resolve(messaging.onMessage(callback));
  }, 1000);
});

export default (app) => {
  const messaging = app.messaging();

  handleMessagingToken(messaging).then(() => {
    messaging.onTokenRefresh(() => handleMessagingToken(messaging));
  });

  // Avoid not receiving messages because the lib is not yet initialized
  messaging.safeOnMessage = onMessage(messaging);

  return messaging;
};
