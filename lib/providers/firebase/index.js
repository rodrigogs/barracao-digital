const admin = require('firebase-admin');
const messagingAdapter = require('./messaging');
const firestoreAdapter = require('./firestore');
const { GOOGLE_APPLICATION_CREDENTIALS } = require('../../config');

// Service account is a base64 encoded file in GOOGLE_APPLICATION_CREDENTIALS environment variable
const serviceAccount = JSON.parse(Buffer.from(GOOGLE_APPLICATION_CREDENTIALS, 'base64').toString('utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://barracao-digital-01.firebaseio.com',
});

const messaging = messagingAdapter(admin);
const firestore = firestoreAdapter(admin);

module.exports = {
  messaging,
  firestore,
};
