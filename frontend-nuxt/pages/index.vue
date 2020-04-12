<template functional>
  <v-card elevation="0" max-width="600">
    <v-card-text
      class="text-center grey--text text--darken-4 title font-weight-regular"
    >
      <p>
        Durante epidemias uma das maneiras de diminuir a lotação dos hospitais é
        criar barracões de atendimento.
      </p>

      <p>
        No <b>Barracão Digital</b> o paciente com sintomas de coronavírus pode
        ser avaliado por um médico voluntário via chamada de video ou de
        telefone.
      </p>
    </v-card-text>

    <v-card-actions class="justify-center">
      <div class="d-flex flex-column">
        <v-btn
          depressed
          x-large
          block
          nuxt
          :to="{ name: 'screening-room' }"
          color="primary"
          class="mb-4 py-10 title"
        >
          Entrar na sala de espera de triagem
        </v-btn>

        <v-btn
          depressed
          x-large
          block
          nuxt
          :to="{ name: 'patient' }"
          color="error"
          class="title"
        >
          Já tenho uma senha de retorno
        </v-btn>
      </div>
    </v-card-actions>
  </v-card>
</template>
