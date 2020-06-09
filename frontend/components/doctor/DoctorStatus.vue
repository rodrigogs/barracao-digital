<template>
  <v-toolbar extended dense dark :color="statusBarColor">
    <v-avatar size="40px" color="grey lighten-5">
      <v-img v-if="$auth.user.email" :src="avatar" :alt="$auth.user.email" />
    </v-avatar>

    <v-spacer></v-spacer>

    <v-btn
      id="cy-doctor-status"
      small
      outlined
      :loading="isLoading"
      :disabled="isLoading"
      @click="toggleServiceStatus"
    >
      {{ buttonText }}
    </v-btn>

    <template v-slot:extension>
      <v-toolbar-title>{{ $auth.user.name }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <DoctorTeamStatusModal />
    </template>
  </v-toolbar>
</template>

<script>
import DoctorTeamStatusModal from '@/components/doctor/DoctorTeamStatusModal'
import avatarUtil from '@/utils/avatar'

export default {
  name: 'DoctorStatus',
  components: {
    DoctorTeamStatusModal,
  },
  props: {
    active: {
      type: Boolean,
      default: false,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    facilityCep: {
      type: String,
      required: true,
    },
    startService: {
      type: Function,
      required: true,
    },
    stopService: {
      type: Function,
      required: true,
    },
  },
  data: () => ({
    avatar: '',
    isLoading: false,
    isLoggingOut: false,
    emailTooltip: false,
  }),
  computed: {
    statusBarColor() {
      return this.active ? 'primary' : 'red'
    },
    buttonText() {
      return this.active ? 'Ficar offline' : 'Ficar online'
    },
  },
  mounted() {
    avatarUtil(this.$auth.user.email || this.$auth.user.username).then(
      (imgSrc) => {
        this.avatar = imgSrc
      }
    )
  },
  methods: {
    toggleServiceStatus() {
      this.isLoading = true
      const promise = this.active ? this.stopService : this.startService
      promise().finally(() => {
        this.isLoading = false
      })
    },
  },
}
</script>
