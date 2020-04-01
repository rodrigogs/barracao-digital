<template>
  <div class="app-container">
    <Consent v-if="!isConsentAccepted" />
    <div class="app" v-show="isConsentAccepted">
      <vue-announcer />

      <Header />

      <div class="app-content">
        <router-view></router-view>
      </div>

      <Footer />
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import Consent from '@/components/Consent.vue';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'App',
  components: {
    Header,
    Footer,
    Consent,
  },

  computed: {
    ...mapGetters('consent', ['isConsentAccepted']),
  },

  methods: {
    ...mapActions('consent', ['acceptConsent']),
  },

  mounted() {
    const consentCookie = this.$cookie.get('consent-accepted');
    if (consentCookie) {
      this.acceptConsent();
    }
  },
};
</script>

<style>
  .app,
  .app-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .app-content {
    flex: 1;
    width: 100%;
    max-width: var(--main-content-max-width);
    margin: 0 auto;
    padding: 32px 0;
  }

  @media (max-width: 980px) {
    .app-content {
      width: 90%;
      padding: 16px;
    }
  }
</style>
