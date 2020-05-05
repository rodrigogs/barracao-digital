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

    <ConversationSession
      v-if="hasActiveConversation && isConversationOpen"
      :origin-cep="patient.originCep"
      :doctor-username="doctorUsername"
      :patient-ticket="patient.ticket"
      :is-video-allowed="videoSession && isVideoAllowed"
      :is-doctor="false"
      @close="isConversationOpen = false"
    />

    <v-dialog
      :value="isAlertDialogOpen && hasActiveConversation"
      max-width="380"
      @click:outside="isAlertDialogOpen = false"
    >
      <v-card>
        <v-card-title class="headline">
          O médico irá atendê-lo agora
        </v-card-title>

        <v-card-text v-if="videoSession && textSession">
          <h3>Como você prefere ser atendido?</h3>
        </v-card-text>

        <v-card-actions class="justify-center">
          <v-btn
            v-if="textSession && !videoSession"
            color="primary"
            class="ma-2"
            @click="openChatOnly"
          >
            <v-icon left>mdi-chat</v-icon>
            <span>Entrar na conversa</span>
          </v-btn>

          <v-btn
            v-if="videoSession && !textSession"
            color="primary"
            class="ma-2"
            @click="openChatWithVideo"
          >
            <v-icon left>mdi-video</v-icon>
            <span>Entrar na chamada com vídeo</span>
          </v-btn>

          <v-btn
            v-if="videoSession && textSession"
            color="secondary"
            @click="openChatOnly"
          >
            <v-icon left>mdi-text</v-icon>
            <span>Apenas texto</span>
          </v-btn>

          <v-btn
            v-if="videoSession && textSession"
            color="primary"
            @click="openChatWithVideo"
          >
            <v-icon left>mdi-video</v-icon>
            <span>Com vídeo</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card-subtitle v-if="hasActiveConversation" class="text-center">
      O médico ainda está aguardando o seu contato
    </v-card-subtitle>
    <v-card-actions class="justify-center">
      <v-btn
        v-if="hasActiveConversation"
        class="mt-4 float-right"
        color="accent"
        @click="isAlertDialogOpen = true"
      >
        <span>Quero ser atendido</span>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import linkify from 'vue-linkify'
import ConversationSession from '@/components/conversation/ConversationSession'

export default {
  name: 'PatientOngoing',
  components: {
    ConversationSession
  },
  directives: {
    linkified: linkify
  },
  props: {
    patient: {
      type: Object,
      required: true
    },
    doctorUsername: {
      type: String,
      required: true
    },
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
  },
  data: () => ({
    isConversationOpen: false,
    isAlertDialogOpen: false,
    isVideoAllowed: false
  }),
  computed: {
    hasActiveConversation() {
      return this.videoSession || this.textSession
    },
    textSession() {
      return this.patient.textSession
    },
    videoSession() {
      return this.patient.videoSession
    }
  },
  watch: {
    hasActiveConversation() {
      if (this.hasActiveConversation) {
        setTimeout(() => {
          this.isConversationOpen = false
          this.isAlertDialogOpen = true
        }, 1000)
      } else {
        this.isConversationOpen = false
        this.isAlertDialogOpen = false
      }
    }
  },
  methods: {
    openChatOnly() {
      this.isConversationOpen = true
      this.isAlertDialogOpen = false
      this.isVideoAllowed = false
    },
    openChatWithVideo() {
      this.isConversationOpen = true
      this.isAlertDialogOpen = false
      this.isVideoAllowed = true
    }
  }
}
</script>
