import firebase from 'firebase/app';
import messagingAdapter from './messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyBRyHMWKmQEA3li1d3nX2deKU8ZeVo5pDE',
  authDomain: 'barracao-digital-01.firebaseapp.com',
  databaseURL: 'https://barracao-digital-01.firebaseio.com',
  projectId: 'barracao-digital-01',
  storageBucket: 'barracao-digital-01.appspot.com',
  messagingSenderId: '300542793702',
  appId: '1:300542793702:web:4968a14f5603d68a89e827',
};

export const app = firebase.initializeApp(firebaseConfig);
export const messaging = messagingAdapter(app);
