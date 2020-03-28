<template>
  <div class="container" :class="{ 'stopped': active === 'stop' }">
    <div class="title">{{ message }}</div>
    <div class="actions">
      <button
        class="btn-action"
        :class="{ 'btn-action-active': active === 'start' }"
        :disabled="active === 'signout'"
        @click="start"
      >
        Iniciar atend.
      </button>
      <button
        class="btn-action btn-action-disabled"
        :class="{ 'btn-action-active': active === 'stop' }"
        :disabled="active === 'signout'"
        @click="stop"
      >
        Parar atend. <!-- (active=true está atendendo) post /doctors/id passar no body atributo active -->
      </button>
      <button
        class="btn-action btn-action-disabled"
        :class="{ 'btn-action-active': active === 'signout' }"
        :disabled="active === 'signout'"
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
      active: null,
    };
  },
  computed: {
    ...mapGetters('auth', ['loggedUser']),
  },
  watch: {
    active(status) {
      if (status === 'start') {
        this.message = `Olá, ${this.loggedUser.username}, você está atendendo`;
      } else if (status === 'stop') {
        this.message = `Olá, ${this.loggedUser.username}, você não está atendendo`;
      } else if (status === 'signout') {
        this.message = `Até mais, ${this.loggedUser.username}. Saindo do aplicativo...`;
      }
    },
  },
  mounted() {
    this.message = `Olá, ${this.loggedUser.username}. Selecione uma ação para continuar`;
  },
  methods: {
    ...mapActions('auth', ['logout']),
    ...mapActions('doctors', ['updateDoctor']),
    activate(action) {
      this.active = action;
    },
    start() {
      this.activate('start');
      this.updateDoctor({ username: this.loggedUser.username, active: true });
    },
    stop() {
      this.activate('stop');
      this.updateDoctor({ username: this.loggedUser.username, active: false });
    },
    signOut() {
      try {
        this.activate('signout');
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
