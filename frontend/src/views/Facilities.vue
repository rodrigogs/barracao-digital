<template>
  <div>
    <div>
      <button @click="create" class="btn">Cadastrar nova instalação</button>
    </div>
    <br />
    <div class="facilities">
      <div v-for="item in list" v-bind:key="item.id" class="facilitie">
        <div>Editar</div>
        <p><b>Origem:</b> {{ item.origin }}</p>
        <p><b>Tipo de contato:</b> {{ item.contactType }}</p>
        <p><b>Contato:</b> {{ item.contact || 'Não cadastrado' }}</p>
        <div>
          <button @click="edit(item.origin)" class="btn">Editar instalação</button>
        </div>
        <div>
          <button @click="createNewDestination(item.origin)" class="btn">Criar novo destino</button>
        </div>
        <br />
        <div>
          <div>
            <b>Destinos:</b>
          </div>
          <div
            v-for="(destination, index) in item.destinations"
            v-bind:key="index"
            class="destination"
          >
            <div>{{ destination }}</div>
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
    ...mapActions('facilities', ['refreshList', 'createDestination']),
    create() {
      this.$router.push('/medicos/instalacoes/cadastrar');
    },
    edit(origin) {
      this.$router.push(`/medicos/instalacoes/editar/${origin}`);
    },
    createNewDestination(origin) {
      const destination = window.prompt('Digite o cep do novo destino:');
      this.createDestination({ origin, destination });
    },
  },
  mounted() {
    this.refreshList();
  },
};
</script>

<style scoped>
  .facilities {
    display: grid;
    grid-auto-flow: row;
    grid-row-gap: 8px;
  }
  .facilitie {
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
    border-radius: 4px;
    padding: 16px;
  }
</style>
