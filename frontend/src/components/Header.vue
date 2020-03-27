<template>
  <header class="header">
    <div class="container" style="height: 100%;">
      <div class="header__logo-container">
        <router-link v-if="!isHome" to="/">
          <img class="header__logo" alt="Barracão Covid 19" src="@/assets/logo.png"/>
        </router-link>
      </div>

      <div v-if="isHome" class="header__home-menu">
        <router-link class="header__link" to="/foo">
          Acesso médico
        </router-link>
        <router-link class="header__link" to="/foo">
          <b>
            Quero ajudar
          </b>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  components: {},
  data() {
    return {
      isHome: this.$router.currentRoute.name === 'Home' || this.$router.currentRoute.name === 'PatientLogin',
    };
  },
  watch: {
    $route(to) {
      this.isHome = to.name === 'Home' || to.name === 'PatientLogin';
    },
  },
};
</script>

<style>
  .header {
    background-color: #F3F3F3;
  }

  .header__home-menu {
    display: flex;
    justify-content: space-between;
    height: 100%;
    align-items: center;
  }

  .header__logo-container {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
  }

  .header__logo {
    height: 30px;
  }

  @media screen and (min-width: 768px){
    .header__logo {
      height: 50px;
    }
  }

  .header__link {
    text-decoration: none;
    color: var(--primary-color);
  }

  .header__link:hover {
    color: var(--primary-color--hover);
  }
</style>
