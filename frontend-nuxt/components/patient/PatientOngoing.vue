<template>
  <v-card-text class="text-center">
    <div class="blue--text title font-weight-medium">
      <p>
        O médico <b>{{ doctorName }}</b> está entrando em contato com você.
      </p>
      <p>Siga as instruções abaixo:</p>
    </div>

    <v-card>
      <v-card-text class="text-left subtitle-1">
        {{ doctorFeedback }}
      </v-card-text>
    </v-card>
  </v-card-text>
</template>

<script>
export default {
  name: 'PatientOngoing',
  props: {
    doctorName: {
      type: String,
      required: true
    },
    doctorFeedback: {
      type: String,
      required: true
    }
  }
}
</script>
