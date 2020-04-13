<template>
  <v-app>
    <v-app-bar app elevation="1" height="80">
      <v-row align="center" justify="center" no-gutters>
        <v-col class="text-center">
          <v-btn v-if="displayManageRoute" text nuxt :to="{ name: 'manage' }">
            Gerenciar
          </v-btn>
          <v-btn v-else text nuxt :to="{ name: 'doctor' }">
            Acesso médico
          </v-btn>
        </v-col>
        <v-col
          v-show="!$vuetify.breakpoint.xsOnly"
          class="text-center"
          align-self="center"
        >
          <nuxt-link class="d-flex align-center" :to="{ name: 'index' }">
            <Logo />
          </nuxt-link>
        </v-col>
        <v-col class="text-center">
          <v-badge color="warning" icon="mdi-wrench" overlap>
            <v-btn text href="#">Quero ajudar</v-btn>
          </v-badge>
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
        <v-btn text small href="mailto:faleconosco@barracaodigital.com">
          faleconosco@barracaodigital.com
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
    displayManageRoute() {
      return this.$auth.loggedIn && this.$nuxt.$route.name === 'doctor'
    }
  }
}
</script>
