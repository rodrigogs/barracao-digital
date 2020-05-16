import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
import { attachCustomCommands } from 'cypress-firebase'

const config = JSON.parse(
  Buffer.from(Cypress.env('FIREBASE_CONFIG'), 'base64').toString('utf8')
)

firebase.initializeApp(config.FIREBASE_CONFIG)
attachCustomCommands({ Cypress, cy, firebase })
