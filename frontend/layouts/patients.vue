<template>
  <v-app>
    <v-app-bar app elevation="1" height="80">
      <v-container>
        <v-row align="center" justify="center">
          <v-col class="text-center" align-self="center">
            <nuxt-link class="d-flex align-center" :to="{ name: 'index' }">
              <Logo :width="$vuetify.breakpoint.xsOnly ? '150' : '200'" />
            </nuxt-link>
          </v-col>
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
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  }
}
</script>
