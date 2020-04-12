<template>
  <v-card-text class="text-center">
    <p class="title red--text">
      {{ name }}, nossa equipe está sobrecarregada no momento.
    </p>

    <p class="subtitle-1">
      Tente novamente mais tarde.
    </p>
  </v-card-text>
</template>

<script>
export default {
  name: 'PatientCantBeAssisted',
  props: {
    name: {
      type: String,
      required: true
    }
  }
}
</script>
