<template>
  <v-app>
    <div class="app-container">
      <div class="app">
        <Header />

        <div class="app-content">
          <router-view></router-view>
        </div>

        <Footer />
      </div>
    </div>
  </v-app>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

export default {
  name: 'App',
  components: {
    Header,
    Footer,
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
    margin: 0 auto;
    padding: 32px;
  }

  @media (max-width: 980px) {
    .app-content {
      padding: 16px;
    }
  }

  html { overflow-y: hidden }
</style>
