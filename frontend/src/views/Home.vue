<template>
  <section class="home">
    <Logo />

    <p>
      Durante epidemias uma das maneiras de diminuir a lotação dos hospitais é criar barracões de atendimento.
      <br>
      <br>
      No <strong>Barracão Digital</strong> o paciente com sintomas de coronavírus pode ser avaliado por um médico voluntário via chamada de video ou de telefone.
    </p>

    <router-link :to="{ name: 'PatientSignUp' }" class="btn home__button-link">
      Entrar na sala de espera de triagem
    </router-link>

    <router-link :to="{ name: 'PatientLogin' }" class="btn-secondary home__button-link">
      Já tenho uma senha de retorno
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
  margin-top: 2rem;
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
  color: white;
}

.home__button-link:last-child {
  margin-top: 1.25rem;
}
</style>
