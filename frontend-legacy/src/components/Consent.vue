<template>
  <v-container>
    <v-row justify="center">
      <p>Adesão para pacientes:</p>
    </v-row>
    <v-row justify="center">
      <p class="disclaimer-text">Estou ciente de que a plataforma “BARRACÃO DIGITAL” decorre de ação de voluntários com vistas a proporcionar atendimento remoto por profissionais da saúde. Trata-se de medida paliativa e alternativa com regramento legal pertinente que objetiva proporcionar auxílio sem ônus, mas com as limitações e circunstâncias pertinentes e decorrentes, às quais me submeto sob conta e risco.</p>
    </v-row>
    <v-row justify="center">
      <button class="btn" @click="acceptConsent">Aceitar e continuar</button>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';
import Header from '@/components/Header.vue';

export default {
  name: 'Consent',
  methods: {
    ...mapActions('consent', ['acceptConsent']),
  },
};
</script>

<style scoped>
.disclaimer-text {
  max-width: 730px;
  text-align: center;
}
</style>
