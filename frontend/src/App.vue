<template>
  <div class="app-container">
    <div class="app">
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

import { firebase } from '@/providers';

export default {
  name: 'App',
  components: {
    Header,
    Footer,
  },

  async created() {
    try {
      await firebase.messaging.onMessage((payload) => {
        console.log({ payload });
      });
    } catch (err) {
      console.error(err);
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
