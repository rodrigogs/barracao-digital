<template>
  <section class="section home">
    <Logo />

    <p>
      Antes de sair de casa para buscar atendimento, faça sua avaliação digital segura com um
      profissional.
    </p>

    <router-link :to="{ name: 'PatientSignUp' }" class="btn home__button-link">
      Entrar na sala de espera de triagem
    </router-link>

    <router-link :to="{ name: 'PatientLogin' }" class="btn-secondary home__button-link">
      Ja tenho uma senha de retorno
    </router-link>
  </section>
</template>

<script>
import Logo from '@/components/Logo.vue';

export default {
  name: 'Home',
  components: { Logo },
};
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.home > p {
  text-align: center;
  max-width: var(--breakpoint-sm);
  margin: auto;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.home__button-link {
  font-size: 1.5rem;
  text-decoration: none;
  display: block;
  margin-left: auto;
  margin-right: auto;
  max-width: 400px;
  width: 100%;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  box-sizing: border-box;
}

.home__button-link:last-child {
  margin-top: 1.25rem;
}
</style>
