<template>
  <header class="header">
    <section class="section">
      <div class="container">
        <router-link class="header__logo-container" v-if="isHome" to="/">
          <img class="header__logo" alt="Barracão Covid 19" src="@/assets/logo.png"/>
        </router-link>

        <div v-if="!isHome" class="header__home-menu">
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
    </section>
  </header>
</template>

<script>
export default {
  name: 'Header',
  components: {},
  data() {
    return {
      isHome: false,
    };
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
  }

  .header__logo-container {
    display: block;
  }

  .header__logo {
    width: 100%;
  }

  .header__link {
    text-decoration: none;
    color: var(--primary-color);
  }

  .header__link:hover {
    color: var(--primary-color--hover);
  }
</style>
