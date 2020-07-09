<template>
  <v-card-text class="text-center">
    <p class="title red--text">
      {{ name }}, nossa equipe está sobrecarregada no momento.
    </p>

    <p class="subtitle-1">
      {{ message }}
    </p>

    <v-dialog v-model="dialog" persistent max-width="290">
      <template v-slot:activator="{ on }">
        <v-btn color="error" v-on="on">Desistir</v-btn>
      </template>
      <v-card>
        <v-card-title class="headline">
          Você tem certeza?
        </v-card-title>
        <v-card-text>
          Ao desistir você não poderá mais utilizar sua senha de retorno e
          perderá a preferência na fila.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false">
            Continuar
          </v-btn>
          <v-btn color="error" text :loading="isLoading" @click="giveUp">
            Desistir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card-text>
</template>

<script>
import { PATIENT_STATUS } from '~/constants'

export default {
  name: 'PatientCantBeAssisted',
  props: {
    name: {
      type: String,
      required: true,
    },
    ticket: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: false,
      default: () =>
        'Por favor, anote sua senha de retorno e retorne aqui no site ou aplicativo entre 18 e 21h, que é quando temos um maior número de médicos voluntários on-line. Obrigado pela paciência!',
    },
  },
  data: () => ({
    dialog: false,
    isLoading: false,
  }),
  methods: {
    giveUp() {
      this.isLoading = true
      this.$api
        .setPatientStatus(this.ticket, {
          status: PATIENT_STATUS.GAVE_UP,
        })
        .finally(() => {
          this.isLoading = false
          this.dialog = false
        })
    },
  },
}
</script>
