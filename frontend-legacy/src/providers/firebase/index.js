import firebase from 'firebase/app';
import { FIREBASE_CONFIG } from '@/config';
import messagingAdapter from './messaging';
import firestoreAdapter from './firestore';

if (!FIREBASE_CONFIG) throw new Error('FIREBASE_CONFIG env variable is required');

// Firebase config is a base64 encoded file in VUE_APP_FIREBASE_CONFIG environment variable
const firebaseConfig = JSON.parse(Buffer.from(FIREBASE_CONFIG, 'base64').toString('utf8'));

firebase.initializeApp(firebaseConfig);

export const messaging = messagingAdapter(firebase);
export const firestore = firestoreAdapter(firebase);
