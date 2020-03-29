<template>
  <div>
    <div class="title" :class="{ 'title--stopped': !loggedUser.active }">{{ message }}</div>
    <div class="container" :class="{ 'stopped': !loggedUser.active }">
      <div class="actions">
        <button
          class="btn-action"
          :disabled="loading || loggedUser.active"
          @click="alternateDoctor(true)"
        >
          Iniciar atend.
        </button>
        <button
          class="btn-action"
          :disabled="loading || !loggedUser.active"
          @click="alternateDoctor(false)"
        >
          Parar atend.
        </button>
        <button
          class="btn-action"
          :disabled="loading || loggedUser.active"
          @click="signOut"
        >
          Sair
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'DoctorStatus',
  data() {
    return {
      loading: false,
      leaving: false,
    };
  },
  computed: {
    ...mapGetters('auth', ['loggedUser']),
    message() {
      if (this.loading) {
        return 'Alternando status de atendimento';
      }
      if (this.leaving) {
        return 'Saindo do aplicativo';
      }
      if (this.loggedUser.active) {
        return `Olá, ${this.loggedUser.username}, você está atendendo`;
      }
      return `Olá, ${this.loggedUser.username}, você não está atendendo`;
    },
  },
  methods: {
    ...mapActions('auth', ['logout']),
    ...mapActions('doctors', ['alternate']),
    async alternateDoctor(active) {
      if (this.loggedUser.active === active) {
        return;
      }

      this.loading = true;
      await this.alternate();
      this.loading = false;
    },
    signOut() {
      this.loading = true;
      this.leaving = true;
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
  border-radius: 4px;
}

.stopped {
  background: var(--secondary-btn-color);
}

.title {
  font-size: 16px;
  font-weight: bold;
  justify-self: center;
  align-self: center;
  margin-bottom: 8px;
  color: var(--main-btn-color);
}

.title--stopped {
  color: var(--secondary-btn-color);
}

.actions {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 8px;
  justify-self: center;
  align-self: center;
}

.btn-action {
  color: var(--main-btn-color);
  background: #ffffff;

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

.btn-action:disabled {
  color: #9a9a9a;
  background: #cecece;
}
</style>
