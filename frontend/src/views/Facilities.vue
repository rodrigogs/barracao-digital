<template>
  <div>
    Facilities
    <button @click="create">Cadastrar nova instalação</button>
  </div>
</template>

<script>
export default {
  methods: {
    create() {
      this.$router.push('/medicos/instalacoes/cadastrar');
    },
  },
};
</script>

<style scoped>

</style>
