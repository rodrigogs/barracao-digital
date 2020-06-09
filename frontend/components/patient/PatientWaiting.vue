<template>
  <div>
    <v-card>
      <v-toolbar dense dark color="primary">
        <v-toolbar-title>
          Você está na fila de atendimento
        </v-toolbar-title>

        <v-spacer />

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div class="flex align-center text-right" v-on="on">
              <v-icon class="mr-1">
                mdi-clock-outline
              </v-icon>
              <span class="body-2">{{ timeInQueue || '-' }}</span>
            </div>
          </template>
          <span>Tempo na fila</span>
        </v-tooltip>
      </v-toolbar>
      <v-card-text class="text-center">
        <p class="subtitle-1 mb-1">
          Guarde a sua senha de retorno
        </p>
        <v-chip large>
          <v-icon class="mr-2">
            mdi-key
          </v-icon>
          <span class="title">{{ ticket }}</span>
        </v-chip>
      </v-card-text>
    </v-card>

    <v-alert
      icon="mdi-information-outline"
      prominent
      text
      type="info"
      elevation="1"
      class="mt-12 mb-0"
    >
      Não feche esta página, você irá receber instruções dos nossos médicos aqui
    </v-alert>
    <v-progress-linear
      color="blue lighten-2"
      buffer-value="0"
      height="6"
      stream
      class="mt-1 mb-12"
    ></v-progress-linear>

    <v-card>
      <v-card-title>
        Enquanto espera, informe-se
      </v-card-title>
      <v-card-subtitle>
        Mantenha-se atualizado sobre o COVID-19 por fontes confiáveis.
      </v-card-subtitle>
      <v-card-text>
        <ul>
          <li>
            <a
              href="https://www.gov.br/pt-br/noticias/saude-e-vigilancia-sanitaria/2020/03/coronavirus-brasil-fortalece-rede-de-diagnostico-da-doenca/app-coronavirus.png/image_view_fullscreen"
              target="_blank"
              data-content="https://www.gov.br/pt-br/noticias/saude-e-vigilancia-sanitaria/2020/03/coronavirus-brasil-fortalece-rede-de-diagnostico-da-doenca/app-coronavirus.png/image_view_fullscreen"
              data-type="external"
              rel="noopener"
              >Aplicativo Coronavírus-SUS para celular</a
            >
          </li>
          <li>
            <span>Website da</span>
            <a
              href="https://www.paho.org/bra/index.php?option=com_content&amp;view=article&amp;id=6101:folha-informativa-novo-coronavirus-2019-ncov&amp;Itemid=875"
              target="_blank"
              data-content="https://www.paho.org/bra/index.php?option=com_content&amp;view=article&amp;id=6101:folha-informativa-novo-coronavirus-2019-ncov&amp;Itemid=875"
              data-type="external"
              rel="noopener"
            >
              Organização Panamericana da Saúde/Organização Mundial da Saúde
            </a>
          </li>
          <li>
            <span>Website do</span>
            <a
              href="https://coronavirus.saude.gov.br/"
              target="_blank"
              data-content="https://coronavirus.saude.gov.br/"
              data-type="external"
              rel="noopener"
            >
              Ministério da Saúde
            </a>
          </li>
          <li>
            <span>Website da</span>
            <a
              href="https://www.infectologia.org.br/pg/1567/comunicados-e-notas-da-sbi-referente-ao-novo-coronavrus"
              target="_blank"
              data-content="https://www.infectologia.org.br/pg/1567/comunicados-e-notas-da-sbi-referente-ao-novo-coronavrus"
              data-type="external"
              rel="noopener"
            >
              Sociedade Brasileira de Infectologia
            </a>
          </li>
        </ul>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import Kairos from 'kairos'

const ONE_SECOND = 1000

export default {
  name: 'PatientWaiting',
  props: {
    createdAt: {
      type: Number,
      required: true,
    },
    ticket: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    timeInQueue: null,
    timeInterval: null,
  }),
  mounted() {
    this.timeInterval = setInterval(this.setUpTimer.bind(this), ONE_SECOND)
  },
  beforeDestroy() {
    clearInterval(this.timeInterval)
    this.timeInterval = null
  },
  methods: {
    setUpTimer() {
      const timeWaiting = Date.now() - this.createdAt
      this.timeInQueue = Kairos.new(timeWaiting).toString('hh:mm:ss', true)
    },
  },
}
</script>
