<template>
  <div id="facility-not-available">
    <h3 class="mb-8 text-center red--text">
      Infelizmente não encontramos nenhum barracão digital disponível para a sua
      área.
    </h3>

    <v-expansion-panels hover>
      <v-expansion-panel>
        <v-expansion-panel-header class="font-weight-medium">
          O que posso fazer?
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          Informe-se! Separamos aqui algumas fontes de informações confiáveis e
          orientações básicas para seguir.
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header class="font-weight-medium">
          Como saber se tenho sintomas?
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <ul>
            <li>
              Os sintomas mais comuns da COVID-19 são: febre, tosse seca e
              cansaço
            </li>
            <li>
              Outros sintomas menos comuns são: coriza, obstrução nasal, dor de
              garganta e diarréia
            </li>
          </ul>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header class="font-weight-medium">
          O que fazer se NÃO ESTOU COM SINTOMAS, e NÃO TIVE CONTATO com pessoas
          com sintomas e/ou com infecção por coronavírus confirmada?
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          Permaneça em casa o máximo possível e mantenha-se informado
          diariamente pelas fontes oficiais.
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header class="font-weight-medium">
          O que fazer se NÃO ESTOU COM SINTOMAS, mas TIVE CONTATO com pessoas
          com sintomas e/ou com infecção por coronavírus confirmada?
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          Permaneça em casa por 14 dias, pois acredita-se que assintomáticos
          também podem transmitir a doença. Redobre os cuidados de higiene em
          casa, em especial a lavagem de mãos. Mantenha-se informado diariamente
          pelas fontes oficiais.
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header class="font-weight-medium">
          O que fazer se estou com SINTOMAS LEVES?
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <ul>
            <li>
              Permaneça em casa por pelo menos 14 dias depois do início dos
              sintomas, observando as recomendações de isolamento domiciliar
              para diminuir o contágio entre familiares. Uma boa fonte de
              informações sobre como diminuir o risco de transmissão dentro de
              casa é este
              <a
                target="_blank"
                href="https://g1.globo.com/bemestar/coronavirus/noticia/2020/03/17/guia-do-isolamento-domiciliar-como-preparar-sua-casa-para-conviver-com-suspeitos-de-infeccao-por-coronavirus.ghtml"
                >Guia do Isolamento Domiciliar.</a
              >
            </li>
            <li>
              Monitore os seus sintomas e mantenha-se informado pelas fontes
              oficiais sobre onde procurar ajuda caso apresente piora, definida
              como sintomas respiratórios + febre (37,8°C ou mais) por mais de
              24h e/ou falta de ar.
            </li>
            <li>
              Os centros de saúde de referência para sua região podem ser
              consultados
              <a
                target="_blank"
                href="https://portalarquivos2.saude.gov.br/images/pdf/2020/marco/03/Hospitais-estaduais-CORONAV--RUS.pdf"
                >aqui</a
              >
              e os postos de saúde
              <a
                target="_blank"
                href="https://portalarquivos2.saude.gov.br/images/pdf/2020/marco/03/Unidades-B--sicas-de-Sa--de-CORONAV--RUS.pdf"
                >aqui</a
              >.
            </li>
            <li>
              Se precisar ir para o hospital ou centro de saúde, tome os
              seguintes cuidados:
              <ul>
                <li>
                  Caso possua uma máscara hospitalar, use-a. Senão, procure
                  cobrir a boca e o nariz ao tossir ou espirrar com um lenço
                  descartável, e descarte-o logo após.
                </li>
                <li>Evite encostar com as mãos no rosto.</li>
                <li>
                  Se possível, evite transporte público: vá no seu veículo, ou
                  use táxi/aplicativo de transporte, sentando no banco de trás e
                  com os vidros abertos.
                </li>
                <li>
                  Evite encostar com as mãos em superfícies no trajeto e dentro
                  no hospital.
                </li>
              </ul>
            </li>
          </ul>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header class="font-weight-medium">
          O que fazer se estou com SINTOMAS MODERADOS/GRAVES (sintomas
          respiratórios + febre de 37,8°C ou mais por mais de 24h e/ou falta de
          ar)?
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <p>
            Dirija-se para o hospital de referência da sua região, que pode ser
            consultado no link:
          </p>
          <p>
            Hospitais de referência podem ser consultados
            <a
              target="_blank"
              href="https://portalarquivos2.saude.gov.br/images/pdf/2020/marco/03/Hospitais-estaduais-CORONAV--RUS.pdf"
              >aqui</a
            >
            e os postos de saúde
            <a
              target="_blank"
              href="https://portalarquivos2.saude.gov.br/images/pdf/2020/marco/03/Unidades-B--sicas-de-Sa--de-CORONAV--RUS.pdf"
              >aqui</a
            >.
          </p>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header class="font-weight-medium">
          Fontes oficiais de informação
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <ul>
            <li>Aplicativo Coronavirus-SUS para celular</li>
            <li>
              Website da
              <a
                target="_blank"
                href="https://www.paho.org/bra/index.php?option=com_content&view=article&id=6101:folha-informativa-novo-coronavirus-2019-ncov&Itemid=875"
                >Organização Panamericana da Saúde/Organização Mundial da
                Saúde</a
              >
              sobre o coronavírus.
            </li>
            <li>
              Website do
              <a target="_blank" href="https://coronavirus.saude.gov.br"
                >Ministério da Saúde</a
              >
              sobre o coronavírus.
            </li>
            <li>
              Website da
              <a
                target="_blank"
                href="https://www.infectologia.org.br/pg/1567/comunicados-e-notas-da-sbi-referente-ao-novo-coronavrus"
                >Sociedade Brasileira de Infectologia</a
              >
              sobre o coronavírus.
            </li>
          </ul>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
export default {
  name: 'PatientFacilityNotAvailable',
}
</script>
