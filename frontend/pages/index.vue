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

    <v-container class="mt-12">
      <v-row justify="center">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-badge color="warning" icon="mdi-wrench" overlap>
              <v-btn text href="#" small v-on="on">Quero ajudar</v-btn>
            </v-badge>
          </template>
          <span>Em construção</span>
        </v-tooltip>
      </v-row>
    </v-container>
  </v-card>
</template>
