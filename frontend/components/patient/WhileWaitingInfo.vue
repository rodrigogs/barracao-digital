<template>
  <v-card>
    <v-card-title>
      Enquanto espera, informe-se
    </v-card-title>
    <v-card-subtitle>
      Mantenha-se atualizado sobre o COVID-19 por fontes confiáveis.
    </v-card-subtitle>
    <v-card-text>
      <v-row>
        <v-col cols="12" lg="6">
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
        </v-col>

        <v-col cols="12" lg="6">
          <style>
            .embed-container {
              position: relative;
              padding-bottom: 56.25%;
              height: 0;
              overflow: hidden;
              max-width: 100%;
            }
            .embed-container iframe,
            .embed-container object,
            .embed-container embed {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
            }
          </style>
          <div class="embed-container">
            <iframe
              src="https://drive.google.com/file/d/1P3LQqW117w0UwCA-jn5F5P91oPFqOKy8/preview"
              frameborder="0"
              allowfullscreen
            ></iframe>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'WhileWaitingInfo',
}
</script>
