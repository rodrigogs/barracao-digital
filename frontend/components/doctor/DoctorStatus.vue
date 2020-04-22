<template>
  <v-toolbar extended dense dark :color="statusBarColor">
    <v-toolbar-title>{{ title }}</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn
      small
      outlined
      :loading="isLoading"
      :disabled="isLoading"
      @click="toggleServiceStatus"
    >
      {{ buttonText }}
    </v-btn>

    <template v-slot:extension>
      <v-spacer></v-spacer>
      <DoctorTeamStatusModal />
    </template>
  </v-toolbar>
</template>

<script>
import DoctorTeamStatusModal from '@/components/doctor/DoctorTeamStatusModal'

export default {
  name: 'DoctorStatus',
  components: {
    DoctorTeamStatusModal
  },
  props: {
    active: {
      type: Boolean,
      defaulf: false,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    facilityCep: {
      type: String,
      required: true
    },
    startService: {
      type: Function,
      required: true
    },
    stopService: {
      type: Function,
      required: true
    }
  },
  data: () => ({
    isLoading: false,
    isLoggingOut: false
  }),
  computed: {
    statusBarColor() {
      return this.active ? 'primary' : 'red'
    },
    title() {
      if (this.isLoggingOut) {
        return 'Saindo do aplicativo'
      }

      if (this.active) {
        return `Olá, ${this.username}, você está atendendo`
      }

      return `Olá, ${this.username}, você não está atendendo`
    },
    buttonText() {
      return this.active ? 'Parar atendimento' : 'Iniciar atendimento'
    }
  },
  methods: {
    toggleServiceStatus() {
      this.isLoading = true
      const promise = this.active ? this.stopService : this.startService
      promise().finally(() => {
        this.isLoading = false
      })
    }
  }
}
</script>
