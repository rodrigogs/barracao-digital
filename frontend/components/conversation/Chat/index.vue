<template>
  <v-card class="fill-height d-flex flex-column elevation-4" flat>
    <v-card-text class="history fill-height d-flex flex-column grey lighten-5">
      <ChatHistory class="pa-2 ma-1 flex-grow-1"></ChatHistory>
    </v-card-text>
    <v-card-actions class="actions blue-grey lighten-5">
      <ChatActions></ChatActions>
    </v-card-actions>
  </v-card>
</template>

<script>
import ChatActions from './ChatActions'
import ChatHistory from './ChatHistory'

export default {
  name: 'Chat',
  components: {
    ChatActions,
    ChatHistory
  }
}
</script>

<style scoped>
.actions {
  padding: 0 5vh 1vh 5vh;
}
.history {
}
</style>
