<template>
  <div class="container" :class="{ 'stopped': loggedUser.active }">
    <div class="title">{{ loggedUser.active }}</div>
    <div class="actions">
      <button
        class="btn-action"
        :class="{ 'btn-action-active': loggedUser.active && !loading }"
        :disabled="loading"
        @click="alternate()"
      >
        Iniciar atend.
      </button>
      <button
        class="btn-action btn-action-disabled"
        :class="{ 'btn-action-active': !loggedUser.active && !loading }"
        :disabled="loading"
        @click="alternate()"
      >
        Parar atend.
      </button>
      <button
        class="btn-action btn-action-disabled"
        :disabled="loading"
        @click="signOut"
      >
        Sair
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'DoctorStatus',
  data() {
    return {
      doctor: 'Little',
      message: null,
      loading: false,
    };
  },
  computed: {
    ...mapGetters('auth', ['loggedUser']),
  },
  mounted() {
    this.message = `Olá, ${this.loggedUser.username}. Selecione uma ação para continuar`;
  },
  methods: {
    ...mapActions('auth', ['logout']),
    ...mapActions('doctors', ['alternate']),
    signOut() {
      try {
        this.logout();
        this.$router.push('/login');
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
.container {
  color: #ffffff;
  background: var(--main-btn-color);
  font-size: 14px;
  display: flex;

  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding-left: 16px;
  padding-right: 16px;
  padding-top: 12px;
  padding-bottom: 15px;
}

.stopped {
  background: var(--secondary-btn-color);
}

.title {
  justify-self: center;
  align-self: center;
  margin-bottom: 4px;
}

.actions {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 8px;
  justify-self: center;
  align-self: center;
}

.btn-action {
  color: #9a9a9a;
  background: #cecece;
  height: 32px;
  width: 100%;
  font-size: 13px;
  font-weight: bold;
  border-radius: 4px;
  border: none;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
}

.btn-action-active {
  color: var(--main-btn-color);
  background: #ffffff;
}
</style>
