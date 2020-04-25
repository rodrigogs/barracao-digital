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

          <v-menu v-if="isLoggedIn">
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item v-if="isLoggedIn" nuxt :to="{ name: 'profile' }">
                <v-list-item-icon>
                  <v-icon>mdi-account-settings</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Perfil</v-list-item-title>
              </v-list-item>

              <v-list-item
                v-if="isMaster"
                nuxt
                :to="{ name: 'manage-facilities' }"
              >
                <v-list-item-icon>
                  <v-icon>mdi-hospital-building</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Instalações</v-list-item-title>
              </v-list-item>

              <v-list-item
                v-if="isAdmin || isMaster"
                nuxt
                :to="{ name: 'manage-doctors' }"
              >
                <v-list-item-icon>
                  <v-icon>mdi-doctor</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Médicos</v-list-item-title>
              </v-list-item>

              <v-list-item @click="reportingIssue = true">
                <v-list-item-icon>
                  <v-icon>mdi-alert-circle-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Reportar problema</v-list-item-title>
              </v-list-item>

              <v-list-item v-if="isLoggedIn" @click="logout">
                <v-list-item-icon>
                  <v-icon>mdi-logout</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Sair</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-tooltip v-else bottom>
            <template v-slot:activator="{ on }">
              <ReportIssueDialog v-on="on"></ReportIssueDialog>
            </template>
            <span>Reportar problema</span>
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
        <v-spacer />

        <v-btn text small href="mailto:faleconosco@barracaodigital.com">
          faleconosco@barracaodigital.com
        </v-btn>

        <v-spacer />

        <v-btn text small href="mailto:faleconosco@barracaodigital.com">
          <small>v{{ version }}</small>
        </v-btn>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import { version } from '../package.json'
import ReportIssueDialog from '~/components/ReportIssueModal'
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo,
    ReportIssueDialog
  },
  data: () => ({
    reportingIssue: false
  }),
  computed: {
    ...mapState('worklist', {
      filters: 'filters'
    }),
    isLoggedIn() {
      return this.$auth.loggedIn
    },
    isAdmin() {
      return this.$auth.loggedIn && this.$auth.user.admin
    },
    isMaster() {
      return this.$auth.loggedIn && this.$auth.user.master
    },
    version() {
      return version
    }
  },
  methods: {
    logout() {
      this.$auth.logout().then(
        () => this.$router.push({ name: 'login' }),
        () => {}
      )
    }
  }
}
</script>
