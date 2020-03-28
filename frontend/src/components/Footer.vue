<template functional>
  <footer class="footer">
    <a href="mailto:emailparacontato@barracao.com.br">emailparacontato@barracao.com.br</a>
  </footer>
</template>

<style scoped>
  .footer {
    background-color: var(--header-bg-color);
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .footer > a {
    color: var(--primary-color);
  }

  .footer > a:hover {
    color: var(--primary-color--hover);
  }
</style>
