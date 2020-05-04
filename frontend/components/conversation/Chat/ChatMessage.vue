<template>
  <v-row class="chat-message" :class="rowClass">
    <v-col :class="colStyle">
      <v-expand-transition>
        <div
          v-show="show"
          class="message-box elevation-3"
          :class="messageStyle"
        >
          <div class="message-content">
            <v-avatar :class="avatarClass" size="30">
              <v-img
                v-if="isMessageFromMe && avatarImage"
                :src="avatarImage"
              ></v-img>
              <v-icon v-else>mdi-account</v-icon>
            </v-avatar>
            {{ message.text }}
          </div>
        </div>
      </v-expand-transition>
    </v-col>
  </v-row>
</template>

<script>
import md5 from 'crypto-js/md5'

const gravatarWrapper = (email) => {
  const emailMd5 = md5(email.trim())
  return `https://www.gravatar.com/avatar/${emailMd5}`
}

export default {
  name: 'ChatMessage',
  props: {
    doctor: {
      type: Object,
      required: true
    },
    patient: {
      type: Object,
      required: true
    },
    isDoctor: {
      type: Boolean,
      required: true
    },
    message: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    show: false
  }),
  computed: {
    isMessageFromMe() {
      return this.isDoctor
        ? this.message.from === 'doctor'
        : this.message.from === 'patient'
    },
    messageStyle() {
      return this.isMessageFromMe
        ? 'right-message amber lighten-4'
        : 'left-message blue lighten-4'
    },
    rowClass() {
      return this.isMessageFromMe ? 'right-row' : 'left-row'
    },
    avatarClass() {
      return this.isMessageFromMe ? 'right-avatar' : 'left-avatar'
    },
    colStyle() {
      return this.isMessageFromMe ? 'd-flex justify-end' : ''
    },
    avatarImage() {
      const email = this.isDoctor ? this.doctor.email : this.patient.email
      if (email) return gravatarWrapper(email)
      return null
    }
  },
  created() {
    setTimeout(() => {
      this.show = true
    }, 100)
  }
}
</script>

<style scoped>
.message-box {
  float: left;
  min-height: 30px;
  margin-left: 5px;
  border-radius: 8px;
}
.message-content {
  float: left;
  margin: 5px;
  padding: 5px 10px 5px 10px;
}
.right-row {
  display: contents;
}
.right-avatar {
  float: right;
  margin: 0 0 0 10px;
}
.left-avatar {
  margin: 0 10px 0 0;
}
</style>
