<template>
  <v-dialog v-model="dialog" max-width="800" @click:outside="dialog = false">
    <template v-slot:activator="{ on }">
      <v-btn small text v-on="on">Status da equipe</v-btn>
    </template>

    <v-card ref="modal">
      <v-card-title>
        Status da equipe
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-list two-line>
        <v-list-item v-for="doctor of doctors" :key="doctor.username">
          <v-list-item-content>
            <v-list-item-title>{{ doctor.name }}</v-list-item-title>
            <v-list-item-subtitle class="text--primary">
              {{ doctor.specialty }}
            </v-list-item-subtitle>
            <v-list-item-subtitle>{{ doctor.email }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-list-item-action-text
              v-text="getDoctorStatus(doctor.active)"
            ></v-list-item-action-text>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    doctors: [],
    doctorsSubscription: null
  }),
  watch: {
    dialog() {
      if (this.dialog) {
        this.doctorsSubscription = this.$fireStore
          .collection('facilities')
          .doc(this.$auth.user.cep)
          .collection('doctors')
          .onSnapshot((snapshot) => {
            this.doctors = snapshot
              .docChanges()
              .map((change) => change.doc.data())
          })
      } else {
        this.doctorsSubscription && this.doctorsSubscription()
      }
    }
  },
  destroyed() {
    this.doctorsSubscription && this.doctorsSubscription()
  },
  methods: {
    getDoctorStatus(doctorActive) {
      return (doctorActive && 'Ativo') || 'Inativo'
    }
  }
}
</script>
