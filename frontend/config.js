/* eslint-disable node/no-process-env */

const isBrowser = typeof window !== 'undefined'

export const normalizeEnv = (ignoreErrors) => {
  const NODE_ENV = process.env.NODE_ENV || 'development'
  return {
    NODE_ENV,
    BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
    API_URL:
      process.env.API_URL || `https://api.barracaodigital.com/${NODE_ENV}`,
    SENTRY_DSN: process.env.SENTRY_DSN || '',
    SENTRY_DISABLE_SERVER_SIDE:
      String(process.env.SENTRY_DISABLE_SERVER_SIDE) === 'true',
    SENTRY_DISABLE_SERVER_RELEASE:
      String(process.env.SENTRY_DISABLE_SERVER_RELEASE) === 'true',
    OPENTOK_API_KEY: process.env.OPENTOK_API_KEY,
    OPENTOK_API_SECRET: process.env.OPENTOK_API_SECRET,
    get FIREBASE_CONFIG() {
      if (!process.env.FIREBASE_CONFIG) {
        if (ignoreErrors) return
        throw new Error(
          'You must provide a base64 firebase config in order to run the project'
        )
      }
      return typeof process.env.FIREBASE_CONFIG === 'object' // It is already an object in nuxt application
        ? process.env.FIREBASE_CONFIG
        : isBrowser // Detect if it's running in browser context
        ? JSON.parse(atob(process.env.FIREBASE_CONFIG)) // User window.atob
        : JSON.parse(
            Buffer.from(process.env.FIREBASE_CONFIG, 'base64').toString('utf8')
          ) // Use node buffer
    }
  }
}

const defaultConfig = normalizeEnv(true)
// Default
export default defaultConfig
// Named configs
export const NODE_ENV = defaultConfig.NODE_ENV
export const BASE_URL = defaultConfig.BASE_URL
export const API_URL = defaultConfig.API_URL
export const SENTRY_DSN = defaultConfig.SENTRY_DSN
export const SENTRY_DISABLE_SERVER_RELEASE =
  defaultConfig.SENTRY_DISABLE_SERVER_RELEASE
export const OPENTOK_API_KEY = defaultConfig.OPENTOK_API_KEY
export const OPENTOK_API_SECRET = defaultConfig.OPENTOK_API_SECRET
export const FIREBASE_CONFIG = defaultConfig.FIREBASE_CONFIG
