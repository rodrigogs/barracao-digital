import admin from 'firebase-admin'
import messagingAdapter from './messaging'
import firestoreAdapter from './firestore'
import { GOOGLE_APPLICATION_CREDENTIALS } from '../../config'

// Service account is a base64 encoded file in GOOGLE_APPLICATION_CREDENTIALS environment variable
const serviceAccount = JSON.parse(
  Buffer.from(GOOGLE_APPLICATION_CREDENTIALS, 'base64').toString('utf8')
)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://barracao-digital-${process.env.NODE_ENV}.firebaseio.com`,
})

const messaging = messagingAdapter(admin)
const firestore = firestoreAdapter(admin)

export { messaging, firestore }
