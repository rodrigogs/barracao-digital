<template>
  <header class="header">

    <div class="header-content">
      <router-link
        class="header__logo"
        :to="{ name: 'Home' }"
        v-if="!isHome"
      >
        <Logo />
      </router-link>

      <template v-else class="header__home-menu">
        <router-link class="header__link" :to="{ name: 'DoctorWorklist' }">
          Acesso médico
        </router-link>
        <router-link class="header__link" to="/voluntariado">
          <b>Quero ajudar</b>
        </router-link>
      </template>
    </div>
  </header>
</template>

<script>
import Logo from '@/components/Logo.vue';

export default {
  name: 'Header',
  components: { Logo },
  computed: {
    isHome() {
      return ['Home', 'PatientLogin'].includes(this.$route.name);
    },
  },
};
</script>

<style scoped>
.header {
  background-color: var(--header-bg-color);
  padding: 0.75rem 1rem;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: var(--breakpoint-sm);
  margin-left: auto;
  margin-right: auto;
}

.header__home-menu {
  display: flex;
  justify-content: space-between;
  height: 100%;
  align-items: center;
}

.header__logo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  margin: 0 auto;
}

.header__link {
  text-decoration: none;
  color: var(--primary-color);
}

.header__link:hover {
  color: var(--primary-color--hover);
  text-decoration: underline;
}
</style>
