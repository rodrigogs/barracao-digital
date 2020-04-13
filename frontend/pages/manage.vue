<template>
  <v-banner width="100%" max-width="600px" single-line>
    <v-icon slot="icon" color="warning" size="36">
      mdi-wrench
    </v-icon>
    <span>Esta página está em construção</span>

    <template v-slot:actions>
      <v-btn color="primary" text @click="$router.go(-1)">
        Voltar
      </v-btn>
    </template>
  </v-banner>
</template>

<script>
export default {
  middleware: 'auth'
}
</script>
