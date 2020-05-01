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

    <OpentokSession
      v-if="hasOpentokCredentials && isVideoChatOpen"
      :session-id="videoSession.sessionId"
      :token="videoSession.token"
      @close="isVideoChatOpen = false"
    />

    <v-dialog
      :value="isAlertDialogOpen && hasOpentokCredentials"
      max-width="380"
    >
      <v-card>
        <v-card-title class="headline">
          O médico irá te atender agora
        </v-card-title>

        <v-card-actions class="justify-space-between mt-6">
          <v-btn outlined @click="isAlertDialogOpen = false">
            Cancelar
          </v-btn>

          <v-btn color="primary" @click="openVideoChat">
            <v-icon left>mdi-video</v-icon>
            <span>Iniciar sessão</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-btn
      v-if="hasOpentokCredentials"
      class="mt-4 float-right"
      color="green"
      outlined
      @click="openVideoChat"
    >
      <v-icon left>mdi-video</v-icon>
      <span>Iniciar sessão</span>
    </v-btn>
  </v-card>
</template>

<script>
import linkify from 'vue-linkify'
import OpentokSession from '@/components/opentok/OpentokSession.vue'

export default {
  name: 'PatientOngoing',
  components: {
    OpentokSession
  },
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
    },
    videoSession: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    isVideoChatOpen: false,
    isAlertDialogOpen: true
  }),
  computed: {
    hasOpentokCredentials() {
      return (
        this.videoSession &&
        this.videoSession.sessionId &&
        this.videoSession.token
      )
    }
  },
  methods: {
    openVideoChat() {
      this.isVideoChatOpen = true
      this.isAlertDialogOpen = false
    }
  }
}
</script>
