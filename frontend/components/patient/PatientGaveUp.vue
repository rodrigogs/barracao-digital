<template>
  <v-card-text class="text-center">
    <p class="title red--text">
      Você desistiu deste atendimento.
    </p>

    <p class="subtitle-1">
      Para entrar novamente na fila de atentimento
      <nuxt-link to="/screening-room">clique aqui</nuxt-link>.
    </p>
  </v-card-text>
</template>

<script>
export default {
  name: 'PatientGaveUp'
}
</script>
