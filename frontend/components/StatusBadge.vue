<template>
  <v-chip
    v-bind="$attrs"
    outlined
    :color="data.color"
    @click:close="$emit('close')"
  >
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
