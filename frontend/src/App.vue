<template>
  <div class="content">
    <div class="content-wrapper">
      <Header/>
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

  data: () => ({
    //
  }),
};
</script>

<style>
  @import "assets/main.css";

  .content {
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
  }

  .content-wrapper {
    flex: 1;
  }
</style>
