import firebase from 'firebase/app';
import messagingAdapter from './messaging';
import { FIREBASE_CONFIG } from '../../config';

// Firebase config is a base64 encoded file in VUE_APP_FIREBASE_CONFIG environment variable
const firebaseConfig = JSON.parse(atob(FIREBASE_CONFIG));

export const app = firebase.initializeApp(firebaseConfig);
export const messaging = messagingAdapter(app);
