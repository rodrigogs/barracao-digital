<template>
  <v-app>
    <v-app-bar app elevation="1" height="80">
      <v-container>
        <v-row align="center" justify="center">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                nuxt
                :to="{ name: 'doctor', query: filters }"
                v-on="on"
              >
                <v-icon>mdi-view-dashboard</v-icon>
              </v-btn>
            </template>
            <span>Acesso médico</span>
          </v-tooltip>

          <v-spacer />

          <v-col class="text-center" align-self="center">
            <nuxt-link class="d-flex align-center" :to="{ name: 'index' }">
              <Logo :width="$vuetify.breakpoint.xsOnly ? '150' : '200'" />
            </nuxt-link>
          </v-col>

          <v-spacer />

          <v-tooltip v-if="isMaster" bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon nuxt :to="{ name: 'manage-facilities' }" v-on="on">
                <v-icon>mdi-hospital-building</v-icon>
              </v-btn>
            </template>
            <span>Instalações</span>
          </v-tooltip>

          <v-tooltip v-if="isAdmin || isMaster" bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon nuxt :to="{ name: 'manage-doctors' }" v-on="on">
                <v-icon>mdi-doctor</v-icon>
              </v-btn>
            </template>
            <span>Médicos</span>
          </v-tooltip>
        </v-row>
      </v-container>
    </v-app-bar>
    <v-content>
      <v-container>
        <v-layout column justify-center align-center>
          <nuxt keep-alive :keep-alive-props="{ include: 'PagesDoctor' }" />
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
import { mapState } from 'vuex'
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  },
  computed: {
    ...mapState('worklist', {
      filters: 'filters'
    }),
    isAdmin() {
      return this.$auth.loggedIn && this.$auth.user.admin
    },
    isMaster() {
      return this.$auth.loggedIn && this.$auth.user.master
    }
  }
}
</script>
