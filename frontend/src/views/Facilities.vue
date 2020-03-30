<template>
  <div>
    Facilities
    <button @click="create">Cadastrar nova instalação</button>
    <div>
      <div v-for="item in list" v-bind:key="item.id">
        <p>Origem: {{ item.origin }}</p>
        <p>Tipo de contato: {{ item.contactType }}</p>
        <p>Contato: {{ item.contact || 'Não cadastrado' }}</p>
        <div class="">
          <div>Destinos:</div>
          <div v-for="destination in item.destinations">
            {{ destination }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('facilities', ['list']),
  },
  methods: {
    ...mapActions('facilities', ['refreshList']),
    create() {
      this.$router.push('/medicos/instalacoes/cadastrar');
    },
  },
  mounted() {
    this.refreshList();
  },
};
</script>

<style scoped>

</style>
