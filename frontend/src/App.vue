<template>
  <div class="app">
    <vue-announcer />

    <Header/>

    <div class="app-content">
      <router-view></router-view>
    </div>

    <Footer/>
  </div>
</template>

<script>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

export default {
  name: 'App',
  components: {
    Header,
    Footer,
  },
};
</script>

<style>
  @import "assets/main.css";

  .app {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .app-content {
    flex: 1;
    width: 100%;
    max-width: var(--main-content-max-width);
    margin: 0 auto;
  }

  .app-content > div:first-of-type {
    padding: 32px 0;
  }

  @media (max-width: 980px) {
    .app-content > div:first-of-type {
      padding: 16px;
    }
  }
</style>
