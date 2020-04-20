<template>
  <v-card elevation="0">
    <v-card-title>
      Um médico está entrando em contato com você
    </v-card-title>

    <v-card-text>
      <v-list elevation="1">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="headline">
              {{ doctorName }}
            </v-list-item-title>
            <v-list-item-subtitle class="subtitle-1 mb-4">
              <v-icon>mdi-map</v-icon>
              <span>{{ facilityName }}</span>
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              <b>CRM:</b>
              <span>{{ doctorCrm || '-' }}</span>
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              <b>Estado:</b>
              <span>{{ doctorState || '-' }}</span>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-card class="mt-4">
        <v-card-title>Siga as instruções abaixo:</v-card-title>
        <v-card-text class="text-left subtitle-1">
          <div v-linkified v-text="doctorMessage" />
        </v-card-text>
      </v-card>
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
      type: String,
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
