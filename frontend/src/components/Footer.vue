<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="email">emailparacontato@barracao.com.br</div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Header',
};
</script>

<style scoped>
  .footer {
    background-color: #F3F3F3;
  }
  .footer-content {
    height: 100%;
    width: 100%;
    max-width: var(--main-content-max-width);
    margin: 0 auto;
  }
  .email {
    width: 100%;
    text-align: center;
    padding-top: 8px;
  }
</style>
