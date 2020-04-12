import 'firebase/messaging';

const requestPermission = async (messaging) => {
  try {
    await messaging.requestPermission();
    console.log('Permission granted for the messaging service!');
  } catch (err) {
    console.error('Unable to get messaging token', err);
  }
};

export default (app) => {
  const messaging = app.messaging();
  requestPermission(messaging);
  return messaging;
};
