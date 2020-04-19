<template>
  <v-chip outlined :color="data.color">
    {{ data.text }}
  </v-chip>
</template>

<script>
import patientStatusToText from '~/utils/patientStatusToText'

export default {
  name: 'StatusBadge',
  props: {
    status: {
      type: String,
      required: true
    }
  },
  computed: {
    data() {
      return patientStatusToText(this.status)
    }
  }
}
</script>
