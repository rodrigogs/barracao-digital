<template>
  <section class="section">
    <div class="container">

      <div class="img-container home__img-logo">
        <img src="@/assets/logo-grande.png"/>
      </div>

      <p class="home__text-container">
        Antes de sair de casa para buscar atendimento, faça sua avaliação digital segura com um profissional.
      </p>

      <router-link to="/pacientes/registrar" class="btn home__button-link" style="padding-top: 2.5rem;padding-bottom: 2.5rem;">
        Entrar na sala de espera de triagem
      </router-link>
      <router-link to="/pacientes/login" class="btn-secondary home__button-link" block color="#FF4136">
        Ja tenho uma senha de retorno
      </router-link>
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
  .home__img-logo {
    max-width: 600px;
    margin: auto;
  }

  .home__text-container {
    text-align: justify;
    max-width: 500px;
    margin: auto;
  }

  .home__button-link {
    font-size: 1.5rem;
    text-decoration: none;
    display: block;
    margin: auto;
    margin-top: 1.25rem;
  }

  @media screen and (min-width: 768px){
    .home__button-link {
      width: 270px;
    }
  }
</style>
