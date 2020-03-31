<template>
  <div class="consent">
    <header class="header">
      <div class="header-content">
        <div class="header__logo">
          <Logo />
        </div>
      </div>
    </header>
    <div class="content">
      <p class="content-title">
        Adesão para pacientes:
      </p>
      Estou ciente de que a plataforma “BARRACÃO DIGITAL – COVID-19” decorre de ação de voluntários com vistas a proporcionar atendimento remoto por profissionais da saúde. Trata-se de medida paliativa e alternativa com regramento legal pertinente que objetiva proporcionar auxílio sem ônus, mas com as limitações e circunstâncias pertinentes e decorrentes, às quais me submeto sob conta e risco.
    </div>
    <button class="btn" @click="accept">Aceitar e continuar</button>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Logo from '@/components/Logo.vue';
import Header from '@/components/Header.vue';

export default {
  name: 'Consent',
  components: {
    Logo,
  },
  methods: {
    ...mapActions('consent', ['acceptConsent']),
    accept() {
      this.$cookie.set('consent-accepted', 'true', 360);
      this.acceptConsent();
    },
  },
};
</script>

<style scoped>
  .consent {
    height: 100vh;
    width: 100vw;
    position: fixed;
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  .content {
    font-size: 18px;
    font-size: 18px;
    color:rgb(26, 65, 100);
    padding: 24px;
    text-align: center;
  }

  .content-title {
    font-weight: bold;
  }

  .header {
    background-color: var(--header-bg-color);
    padding: 0.75rem 1rem;
    width: 100%;
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
</style>
