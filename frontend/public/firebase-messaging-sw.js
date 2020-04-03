// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.13.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.13.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  apiKey: 'AIzaSyBRyHMWKmQEA3li1d3nX2deKU8ZeVo5pDE',
  authDomain: 'barracao-digital-01.firebaseapp.com',
  databaseURL: 'https://barracao-digital-01.firebaseio.com',
  projectId: 'barracao-digital-01',
  storageBucket: 'barracao-digital-01.appspot.com',
  messagingSenderId: '300542793702',
  appId: '1:300542793702:web:4968a14f5603d68a89e827',
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

// messaging.setBackgroundMessageHandler(function(payload) {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);
//   // Customize notification here
//   const notificationTitle = 'Background Message Title';
//   const notificationOptions = {
//     body: 'Background Message body.',
//     icon: '/firebase-logo.png'
//   };

//   return self.registration.showNotification(notificationTitle, notificationOptions);
// });
