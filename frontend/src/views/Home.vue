<template>
  <section class="section">
    <div class="container">

      <div class="img-container">
        <img src="@/assets/logo-grande.png"/>
      </div>

      <p class="home__text-container">
        Antes de sair de casa para buscar atendimento, faça sua avaliação digital segura com um profissional.
      </p>

      <div class="home__button-container">
        <router-link to="/pacientes/registrar" class="btn btn--link" style="padding-top: 3rem;padding-bottom: 3rem;">
          Entrar na sala de espera
        </router-link>
        <router-link to="/pacientes/login" class="btn-secondary btn--link" block color="#FF4136">
          Ja tenho uma senha de retorno
        </router-link>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Home',
  components: {},
};
</script>

<style>
  .home__button-container {
    display: flex;
    flex-direction: column;
  }

  .home__text-container {
    text-align: justify;
  }

  .home__button-container > .btn--link {
    font-size: 1.5rem;
    text-decoration: none;
  }
</style>
