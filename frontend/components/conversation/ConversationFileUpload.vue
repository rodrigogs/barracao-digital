<template>
  <v-dialog v-model="show" max-width="500">
    <v-card max-width="500" :loading="fileLoading">
      <img
        src="~/assets/file-upload.png"
        width="100%"
        alt="Selecionar Arquivo"
      />
      <v-card-text>
        <v-row>
          <v-file-input id="file-selector" v-model="files" show-size />
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          icon
          :loading="fileLoading"
          @click="show = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-btn
          color="primary"
          icon
          :loading="fileLoading"
          :disabled="!files"
          @click="fileUpload"
        >
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import { STAGE } from '~/config'

export default {
  name: 'ConversationFileUpload',
  props: {
    originCep: {
      type: String,
      required: true,
      default: () => '',
    },
    doctorUsername: {
      type: String,
      required: true,
      default: () => '',
    },
    patientTicket: {
      type: String,
      required: true,
      default: () => '',
    },
    isDoctor: {
      type: Boolean,
      default: () => false,
    },
    value: Boolean,
  },
  data: () => ({
    files: null,
    fileLoading: false,
  }),
  computed: {
    show: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
  },
  methods: {
    ...mapActions('chat', ['sendMessage']),
    fileUpload() {
      this.fileLoading = true
      const fileSelector = document.getElementById('file-selector')
      const file = fileSelector.files[0]
      const reader = new FileReader()
      reader.readAsArrayBuffer(file)
      this.$api
        .requestUploadUrl(
          this.patientTicket,
          JSON.stringify({
            name: file.name,
            type: file.type,
          })
        )
        .then((uploadUrl) => {
          return fetch(uploadUrl, {
            method: 'PUT',
            body: new Blob([reader.result], {
              type: file.type,
            }),
          })
        })
        .then(() => {
          this.sendMessage({
            from: `${this.isDoctor ? 'doctor' : 'patient'}`,
            type: 'file',
            originCep: this.originCep,
            patientTicket: this.patientTicket,
            doctorUsername: this.doctorUsername,
            text: `https://barracao-digital-${STAGE}-conversation-files-bucket.s3.sa-east-1.amazonaws.com/${file.name}`,
          })
          this.fileLoading = false
          this.show = false
        })
    },
  },
}
</script>
