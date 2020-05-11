/* eslint-disable node/no-process-env */
export const NODE_ENV = process.env.NODE_ENV || 'development'

export const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

export const API_URL =
  process.env.API_URL || `https://api.barracaodigital.com/${NODE_ENV}`

export const SENTRY_DSN = process.env.SENTRY_DSN || ''

export const SENTRY_DISABLE_SERVER_SIDE =
  String(process.env.SENTRY_DISABLE_SERVER_SIDE) === 'true'

export const SENTRY_DISABLE_SERVER_RELEASE =
  String(process.env.SENTRY_DISABLE_SERVER_RELEASE) === 'true'

export const OPENTOK_API_KEY = process.env.OPENTOK_API_KEY

export const OPENTOK_API_SECRET = process.env.OPENTOK_API_SECRET

if (!process.env.FIREBASE_CONFIG)
  throw new Error(
    'You must provide a base64 firebase config in order to run the project'
  )
export const FIREBASE_CONFIG =
  typeof process.env.FIREBASE_CONFIG === 'object' // It is already an object in nuxt application
    ? process.env.FIREBASE_CONFIG
    : typeof window === 'undefined' // Detect if it's running in browser context
    ? JSON.parse(
        Buffer.from(process.env.FIREBASE_CONFIG, 'base64').toString('utf8')
      ) // Use node buffer
    : JSON.parse(atob(process.env.FIREBASE_CONFIG)) // User window.atob
