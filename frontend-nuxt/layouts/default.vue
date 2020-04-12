<template>
  <v-app>
    <v-app-bar app elevation="1" height="80">
      <v-row align="center" justify="center" no-gutters>
        <v-col class="text-center">
          <v-btn text nuxt :to="restrictAreaRoute">
            Acesso médico
          </v-btn>
        </v-col>
        <v-col
          v-show="!$vuetify.breakpoint.xsOnly"
          class="text-center"
          align-self="center"
        >
          <nuxt-link class="d-flex align-center" :to="{ name: 'index' }">
            <logo />
          </nuxt-link>
        </v-col>
        <v-col class="text-center">
          <v-btn text href="#">Quero ajudar</v-btn>
        </v-col>
      </v-row>
    </v-app-bar>
    <v-content>
      <v-container>
        <v-layout column justify-center align-center>
          <nuxt keep-alive include="doctor" />
        </v-layout>
      </v-container>
    </v-content>
    <v-footer>
      <v-row justify="center" no-gutters>
        <v-btn text small href="mailto:emailparacontato@barracao.com.br">
          emailparacontato@barracao.com.br
        </v-btn>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  },
  computed: {
    restrictAreaRoute() {
      return { name: this.$auth.loggedIn ? 'doctor' : 'login' }
    }
  }
}
</script>
