require('dotenv').config()
import qs from 'qs'
import colors from 'vuetify/es5/util/colors'

// The firebase configuration is originally in BASE64
const firebaseConfig = JSON.parse(
  Buffer.from(process.env.FIREBASE_CONFIG, 'base64').toString('utf8')
)

export default {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#3060CF', height: '5px' },
  loadingIndicator: { color: '#3060CF' },
  /*
   ** Global CSS
   */
  css: ['~/assets/main.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/vuetify-toast',
    '~/plugins/vuelidate',
    '~/plugins/vue-the-mask',
    '~/plugins/vue-cookie',
    '~/plugins/api'
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
    '@nuxtjs/vuetify'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/auth',
    '@nuxtjs/firebase'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: process.env.API_URL || '',
    paramsSerializer: function(params) {
      return qs.stringify(params, { arrayFormat: 'brackets' })
    }
  },
  auth: {
    redirect: {
      home: '/doctor'
    },
    strategies: {
      local: {
        _scheme: '~/basicAuthScheme.js',
        endpoints: {
          login: {
            url: '/auth/login',
            method: 'post'
          },
          logout: false,
          user: {
            url: '/auth/login',
            method: 'post'
          }
        }
      }
    }
  },
  firebase: {
    config: firebaseConfig, // this is a BASE64 env var, that must be converted to a object
    services: {
      messaging: {
        createServiceWorker: true
      },
      firestore: true
    }
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {},
    optionsPath: './vuetify.options.js'
  },
  vue: {
    config: {
      productionTip: process.env.NODE_ENV === 'development',
      devtools: process.env.NODE_ENV === 'development'
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
}
