<template lang="pug">
  v-card.fill-height.d-flex.flex-column.elevation-4(flat)
    v-card-text.history.fill-height.d-flex.flex-column.grey.lighten-5
      ChatHistory.pa-2.ma-1.flex-grow-1
    v-card-actions.actions.blue-grey.lighten-5
      ChatActions
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
