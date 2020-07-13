import qs from 'qs'
import { normalizeEnv } from './config'

require('dotenv').config()

// eslint-disable-next-line node/no-process-env
const config = normalizeEnv()

export default {
  mode: 'spa',
  env: {
    ...config
  },
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: 'Barracão Digital',
    title: 'Barrãcao Digital',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui'
      },
      {
        hid: 'description',
        name: 'description',
        content:
          'Estruturação rápida de “postos de triagem” virtuais descentralizados para redução de visitas desnecessárias às emergências'
      },
      // OpenGraph
      {
        name: 'og:title',
        content: 'Barracão Digital'
      },
      {
        name: 'og:site_name',
        content: 'Barracão Digital'
      },
      {
        name: 'og:url',
        content: '//www.barracaodigital.com'
      },
      {
        name: 'og:description',
        content:
          'Estruturação rápida de “postos de triagem” virtuais descentralizados para redução de visitas desnecessárias às emergências'
      },
      {
        name: 'og:image',
        content:
          '//raw.githubusercontent.com/rodrigogs/barracao-digital/master/media/barracaodigital-logo.png'
      },
      {
        name: 'og:image:type',
        content: 'image/png'
      },
      {
        name: 'og:image:width',
        content: '514'
      },
      {
        name: 'og:image:height',
        content: '514'
      },
      {
        name: 'og:type',
        content: 'website'
      },
      {
        name: 'og:locale',
        content: 'pt_BR'
      },
      // Twitter
      {
        name: 'twitter:card',
        content: 'summary'
      },
      {
        name: 'twitter:site',
        content: '@barracaodigital'
      },
      {
        name: 'twitter:creator',
        content: '@barracaodigital'
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
    '~/plugins/noty',
    '~/plugins/vuelidate',
    '~/plugins/vue-the-mask',
    '~/plugins/vue-cookie',
    '~/plugins/vue-infinite-loading',
    '~/plugins/api',
    '~/plugins/crm'
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
    '@nuxtjs/firebase',
    '@nuxtjs/sentry',
    'vuetify-dialog/nuxt'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: config.API_URL || '',
    paramsSerializer: function paramsSerializer(params) {
      return qs.stringify(params, { arrayFormat: 'brackets' })
    }
  },
  auth: {
    plugins: ['~/plugins/auth.js'],
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
    config: config.FIREBASE_CONFIG, // this is a BASE64 env var, that must be converted to a object
    services: {
      messaging: {
        createServiceWorker: true
      },
      firestore: true
    }
  },
  pwa: {
    meta: {
      name: 'Barracão Digital',
      description:
        'Estruturação rápida de “postos de triagem” virtuais descentralizados para redução de visitas desnecessárias às emergências',
      lang: 'pt-BR'
    },
    manifest: {
      name: 'Barracão Digital',
      lang: 'pt-BR'
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
      productionTip: config.NODE_ENV === 'development',
      devtools: config.NODE_ENV === 'development'
    }
  },
  /*
   ** Build configuration
   */
  build: {
    transpile: [/vuetify/],
    optimization: {
      splitChunks: {
        cacheGroups: {
          opentok: {
            test: /@opentok\/client/,
            name: 'opentok',
            chunks: 'all'
          },
          vuetify: {
            test: /vuetify/,
            name: 'vuetify',
            chunks: 'all'
          }
        }
      }
    },
    extend(config, ctx) {}
  }
}
