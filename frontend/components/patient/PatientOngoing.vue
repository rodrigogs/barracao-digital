<template>
  <v-card>
    <v-card-title>Um médico está entrando em contato com você.</v-card-title>
    <v-card-text class="text-center">
      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title>Médico:</v-card-title>
              <v-card-text>
                {{ doctorName }}
                <p><strong>CRM:</strong> {{ doctorCrm }}</p>
                <p><strong>Estado:</strong> {{ doctorState }}</p>
                <p><strong>Instalação:</strong> {{ facilityName }}</p>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col v-if="doctorMessage" cols="12">
            <v-card>
              <v-card-title>Siga as instruções abaixo:</v-card-title>
              <v-card-text class="text-left subtitle-1">
                <div v-linkified v-html="doctorMessage" />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import linkify from 'vue-linkify'

export default {
  name: 'PatientOngoing',
  directives: {
    linkified: linkify
  },
  props: {
    doctorName: {
      type: String,
      required: true
    },
    doctorCrm: {
      type: Number,
      required: true
    },
    doctorState: {
      type: String,
      required: true
    },
    doctorMessage: {
      type: String,
      required: true
    },
    facilityName: {
      type: String,
      required: true
    }
  }
}
</script>
