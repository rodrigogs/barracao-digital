const dotenvPlugin = require('cypress-dotenv')
const admin = require('firebase-admin')
const cypressFirebasePlugin = require('cypress-firebase').plugin

module.exports = (on, config) => {
  const extendedConfig = dotenvPlugin(config, {}, true)
  return cypressFirebasePlugin(on, extendedConfig, admin)
}
