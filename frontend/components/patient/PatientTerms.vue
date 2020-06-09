<template>
  <v-card elevation="0" max-width="600">
    <v-btn
      v-if="shouldDisplayGoToEndButton"
      id="go-to-end-btn"
      color="primary"
      fab
      large
      dark
      title="Ir para o final"
      @click="$vuetify.goTo($refs.acceptConcentBtn)"
    >
      <v-icon>mdi-arrow-down</v-icon>
    </v-btn>

    <v-card-text class="grey--text text--darken-4">
      <p class="content-title">
        <b>Termos de uso para utilizadores</b>
      </p>

      <p>
        Por favor, leia estes termos legais antes de utilizar a plataforma
        "BARRACÃO DIGITAL”. Ao utilizar a mesma você aceita e concorda em
        cumprir os termos e condições estabelecidos nos "termos legais de uso".
        Este termo é um acordo vinculativo entre você e a plataforma oferecida
        pelo "BARRACÃO DIGITAL", o que abrange todo o seu acesso e uso de seus
        serviços e aplicativos o que inclui o uso de todas as informações,
        dados, ferramentas, produtos, serviços e outros conteúdos disponíveis
        por meio deste. Ao utilizar esta aplicação, você confirma que compreende
        e concorda com as seguintes regras dispostas:
      </p>

      <p class="content-title">
        <b>1 - Respeito às leis:</b>
      </p>

      <p>
        1.1 O utilizador deverá acessar o "BARRACÃO DIGITAL" apenas para
        finalidades lícitas;
      </p>

      <p>
        1.2 O utilizador concorda em fazer uso da plataforma apenas para os
        devidos fins e em conformidade com o presente termo e limitações legais,
        ditadas por políticas de saúde aplicáveis no Brasil;
      </p>

      <p>
        1.3 O seu acesso é proibido em territórios onde o conteúdo seja
        considerado ilegal. Aquele que optar por acessar este site a partir de
        outras localidades o fará por iniciativa própria e será responsável pelo
        cumprimento das leis brasileiras.
      </p>

      <p>
        1.4- A utilização da plataforma é indicada somente para indivíduos de 16
        (dezesseis) anos de idade ou mais. À luz do Estatuto da Criança e do
        Adolescente todos os menores de 18 (dezoito) anos podem fazer uso, da
        mesma sob orientação de um adulto. Para os menores de dezesseis a
        utilização deve ser feita por um responsável em nome do interessado;
      </p>

      <p>
        1.5 Cidadãos e médicos entendem que a plataforma observa a legislação
        brasileira, tendo sido concebida a partir da observação de todas as
        premissas imperativas. A sua utilização é indicativa da adoção desta
        definição.
      </p>

      <p class="content-title">
        <b>2 - Responsabilidade pelo conteúdo:</b>
      </p>

      <p>
        2.1 O "BARRACÃO DIGITAL" não é responsável pelo conteúdo de quaisquer
        informações eventualmente trocadas pelos utilizadores entre si, ou
        incluídas na plataforma, sejam elas lícitas ou ilícitas. O “BARRACÃO
        DIGITAL” é um serviço gratuito que objetiva facilitar o acesso de um
        utilizador com problema de saúde, com um profissional de saúde, de
        forma, totalmente, gratuita.
      </p>

      <p>
        2.2 O utilizador concorda que é o único responsável pela sua própria
        conduta e pela veracidade das informações fornecidas enquanto utilizar o
        serviço e que é responsável, civil e criminalmente, pelas consequências
        que resultem do fornecimento intencional de dados incorretos;
      </p>

      <p>
        2.3 Ao utilizar o "BARRACÃO DIGITAL" o interessado se compromete em não
        publicar, enviar, distribuir ou divulgar qualquer conteúdo ou informação
        de qualquer categoria, inclusive de caráter difamatório, obsceno ou
        ilícito. Estão resguardadas de sigilo, ainda, as informações de
        propriedade exclusiva pertencentes a outras pessoas ou empresas, bem
        como marcas registradas ou informações protegidas por direitos autorais,
        a menos que haja expressa autorização do detentor dos direitos
        relativos;
      </p>

      <p>
        2.4 Ninguém pode agir em seu nome no uso do "BARRACÃO DIGITAL”. Você é
        responsável pelo conteúdo que indivíduos não autorizados produzirem ao
        usar esta plataforma utilizando, com sua permissão, seu perfil
        cadastrado. Essa regra não se aplica aos casos de violação ou outros
        problemas de segurança da plataforma, o que será tragado à luz da lei
      </p>

      <p class="content-title">
        <b>3 - Acessibilidade ao conteúdo:</b>
      </p>

      <p>
        3.1 A equipe do "BARRACÃO DIGITAL" não garante que esta plataforma
        esteja parcial ou completamente funcional e nem garante que o seu
        objetivo será, plenamente, alcançado, na medida em que, para tanto,
        depende de uma série de fatores externos relacionados com logística,
        qualidade e possibilidade de comunicação e outros. Trata-se de um
        serviço que objetiva auxiliar a sociedade numa situação de emergência.
      </p>

      <p>
        3.2 O utilizador concorda em não tirar 'prints' (screenshots), fotos da
        plataforma, e respeitar o sigilo da comunicação entre o médico que
        presta atendimento e o cidadão que busca o mesmo (atendimento). Postagem
        de conteúdo de conversas e atendimentos em mídias sociais e qualquer
        outro meio público é <strong>ESTRITAMENTE PROIBIDO</strong>. Toda a
        informação enviada ou recebida é de cunho privado.
      </p>

      <p>
        3.3 As informações serão prestadas em atendimento à legislação
        brasileira, especificamente no que é tangente à TELEMEDICINA, a qual é
        regulada por norma especifica.
      </p>

      <p class="content-title">
        <b>4 - Propriedade Intelectual:</b>
      </p>

      <p>
        4.1 O grupo de trabalho, devidamente identificado, como criador do
        "BARRACÃO DIGITAL" é a detentora do direito de autoria dos conteúdos
        produzidos e apresentados nesta plataforma. Esta premissa não se aplica
        às informações consideradas de domínio público ou de utilidade pública
        às quais a plataforma faculta acesso;
      </p>

      <p>
        4.2 Todas as outras marcas comerciais, marcas de serviço, nomes e
        logotipos que aparecem nesta plataforma são de propriedade de seus
        respectivos titulares. A exibição decorre do envolvimento das mesmas com
        a criação do “BARRACÃO DIGITAL”;
      </p>

      <p class="content-title">
        <b
          >4.3 A plataforma "BARRACÃO DIGITAL" é open-source e segue as
          especificações <i>“The 3-Clause BSD License”</i>, sendo que as suas
          prerrogativas podem ser identificadas no endereço
          <a href="https://opensource.org/licenses/BSD-3-Clause" target="_blank"
            >https://opensource.org/licenses/BSD-3-Clause</a
          >.</b
        >
      </p>

      <p>
        4.4 Apenas informações divulgadas pelos serviços de saúde devem ser
        consideradas oficiais para divulgação pública, no que tange aos dados
        relacionados a esse tema;
      </p>

      <p>
        4.5 Os dados coletados por meio da plataforma podem sofrer influência
        pela sua capacidade de acesso a dispositivos móveis com especificações
        tecnológicas mínimas. Deste modo, as informações obtidas por meio da
        plataforma estão sujeitas à interrupção e incompletude considerando as
        limitações de conectividade dos dispositivos utilizados por seus
        usuários;
      </p>

      <p class="content-title">
        <b>5 Leis, regulamentos, direitos e deveres:</b>
      </p>

      <p>
        5.1 É política da equipe do "BARRACÃO DIGITAL" cumprir todas as leis e
        regulamentos aplicáveis, os quais podem ser modificados de tempos em
        tempos. No caso de qualquer disposição do presente Termos de Uso estar
        em conflito com qualquer lei ou regulamento aplicável, a lei ou
        regulamento aplicável substituirá a disposição contrária, sempre de tal
        forma a respeitar o princípio da legalidade. As adaptações decorrentes
        de lei e regulação específica, ainda, são consideradas incorporadas aos
        presentes;
      </p>

      <p>
        5.2 O "BARRACÃO DIGITAL" poderá, mas não é obrigado, a monitorar,
        revisar e restringir o acesso a qualquer de suas áreas onde os
        utilizadores transmitem informações, podendo retirar do ar ou retirar o
        acesso a qualquer destas informações ou comunicações;
      </p>

      <p>
        5.3 - Se você tiver alguma dúvida em relação ao "BARRACÃO DIGITAL" não
        hesite em contatar através de um dos canais informados.
      </p>

      <p class="content-title">
        <b>6 - Uso das contribuições:</b>
      </p>

      <p>
        6.1 - Ao enviar uma mensagem ou postar informações no "BARRACÃO DIGITAL"
        você concede uma licença perpétua, isenta de royalties, licença
        incondicional para essa aplicação pelos Órgãos de Saúde e para fins
        estatísticos;
      </p>

      <p>
        6.2 Todas as informações fornecidas por pessoas ou profissionais de
        saúde são protegidas pela Lei Geral de proteção de Dados Pessoais
        (LGPD), Lei Nº 13.709, de 4 de agosto de 2018;
      </p>

      <p>
        6.3 Segundo o Capítulo II (Do tratamento de dados pessoais), Seção II
        (Do Tratamento de Dados Pessoais Sensíveis), Art. 13. Na realização de
        estudos em saúde pública, os órgãos de pesquisa poderão ter acesso a
        bases de dados pessoais, os quais serão tratados, exclusivamente, dentro
        do órgão e estritamente para a finalidade de realização de estudos e
        pesquisas e mantidos em ambiente controlado e seguro, conforme práticas
        de segurança previstas em regulamento específico e que incluam, sempre
        que possível, a anonimização ou pseudonimização dos dados, bem como
        considerem os devidos padrões éticos relacionados a estudos e pesquisas:
      </p>

      <p>
        6.3.1. § 1° A divulgação dos resultados ou de qualquer excerto do estudo
        ou da pesquisa de que trata o caput deste artigo, em nenhuma hipótese,
        poderá revelar dados pessoais.§ 2° O órgão de pesquisa será o
        responsável pela segurança da informação prevista no caput deste artigo.
        Não é permitida, em circunstância alguma, a transferência dos dados a
        terceiro;
      </p>

      <p>
        6.3.2. § 3° O acesso aos dados de que trata este artigo é objeto de
        regulamentação por parte da autoridade nacional e das autoridades da
        área de saúde e sanitárias, no âmbito de suas competências;
      </p>

      <p>
        6.3.3. § 4° Para os efeitos deste artigo, a pseudonimização é o
        tratamento por meio do qual um dado perde a possibilidade de associação,
        direta ou indireta, a um indivíduo, senão pelo uso de informação
        adicional mantida separadamente pelo controlador em ambiente controlado
        e seguro.
      </p>

      <p class="content-title">
        <b>7 - Garantia de Sigilo e Anonimato:</b>
      </p>

      <p>
        7.1 Será garantido o sigilo e o anonimato de todas as informações
        produzidas por você no "BARRACÃO DIGITAL", exceto conforme exigido por
        lei, ou para tratar de questões de descumprimento da mesma;
      </p>

      <p>
        7.2 O “BARRACÃO DIGITAL” reserva-se o direito de usar metadados para a
        criação de relatórios e análises estatísticas e melhorar a prestação dos
        serviços, mas sempre mantendo o sigilo médico;
      </p>

      <p>
        7.3 O "BARRACÃO DIGITAL", nem os seus criadores e prestadores do
        serviço, seja voluntário ou não, responsabilizam-se por erros ou
        imprecisões na prestação deste serviço. Esta previsão é válida para
        situações normais e, especialmente, quando decorrentes de erros,
        deturpações deliberadas de informações ou de qualquer má-fé de usuários.
        Sendo o caso, ainda, as más condutas serão levadas ao conhecimento das
        autoridades competentes para o trato com a matéria.
      </p>

      <p class="content-title">
        <b>8 - Atualização do "BARRACÃO DIGITAL":</b>
      </p>

      <p>
        8.1 Modificações da plataforma e dos seus termos de uso poderão ocorrer.
        A menos que o usuário manifeste o contrário o seu uso da aplicação
        indica a aceitação integral do Termo de Uso naquela versão vigente ao
        tempo do acesso ao "BARRACÃO DIGITAL". Fique atento quando das
        atualizações e, em caso de dúvida, os Termos de Uso estarão sempre
        disponíveis para acesso e concordância ou não.
      </p>

      <p class="content-title">
        <b>9 - Responsabilidade por ações com base no conteúdo:</b>
      </p>

      <p>
        9.1 - O "BARRACÃO DIGITAL" não assume responsabilidade por quaisquer
        prejuízo e/ou danos a pessoas ou bens, em consequência de qualquer
        utilização das ideias, conteúdos, instruções, métodos, produtos ou
        procedimentos contidos ou decorrentes da sua aplicação;
      </p>

      <p>
        9.2 - Em hipótese alguma os profissionais envolvidos com o
        desenvolvimento ou gestão dessa aplicação serão responsabilizados por
        quaisquer decisão ou ação tomada por você em base no que indicado;
      </p>

      <p>
        9.3 - Diante de ameaças ou qualquer outra situação de risco a vossa
        saúde ou integridade procure, sempre, orientações validadas e
        atualizadas pelos serviços disponíveis de saúde pública.
      </p>

      <p>
        9.4 – O “BARRACÃO DIGITAL” objetiva facilitar a comunicação entre
        pacientes e médicos e toda a troca de informação com vistas a superar a
        epidemia em curso.
      </p>

      <p>
        9.5 – O “BARRACÃO DIGITAL”, como facilitador da Telemedicina não se
        responsabiliza pelas ações de médicos utilizadores da plataforma. Os
        mesmos devem seguir as normas e leis que regulam a sua profissão
        considerando os preceitos dos Conselhos Regionais de Medicina, Conselho
        Federal de Medicina, Ministério da Saúde e quaisquer outros órgãos
        governamentais que regulem a profissão de médico.
      </p>

      <p class="content-title">
        <b>10 Responsabilidade por problemas tecnológicos:</b>
      </p>

      <p>
        10.1 - Eventualmente todo ou parte do conteúdo do “BARRACÃO DIGITAL”
        pode não estar disponível e pode não funcionar corretamente. Fazemos
        esforços razoáveis para evitar problemas tecnológicos, mas podem ocorrer
        problemas tecnológico das mais diversas naturezas, rotinas de
        programação prejudiciais ou problemas relacionados ao aparelho de
        usuário;
      </p>

      <p>
        10.2. A plataforma é fornecida "como está" e "conforme estiver
        disponível" e se estiver disponível. Sem limitar o nosso aviso geral,
        não garantimos a disponibilidade, integridade, pontualidade,
        funcionalidade, confiabilidade, sequenciamento ou a velocidade de
        entrega nessa aplicação ou de qualquer parte do conteúdo;
      </p>

      <p>
        10.3. O "BARRACÃO DIGITAL" não se responsabiliza por qualquer dano ou
        prejuízo causado pelo desempenho ou falha de desempenho de toda ou
        qualquer parte da aplicação. O "BARRACÃO DIGITAL”, ainda, não se
        responsabiliza por quaisquer defeitos, atrasos ou erros resultantes da
        sua utilização desta aplicação;
      </p>

      <p>
        10.4. A utilização de todas as funcionalidades do "BARRACÃO DIGITAL"
        exige disponibilidade do acesso à internet pelo usuário, por wifi ou
        cabo de rede de dados. A ausência desse pré-requisito pode limitar a
        utilização da aplicação com todo o seu potencial de uso. A equipe do
        "BARRACÃO DIGITAL", considerando esse aviso, não assume responsabilidade
        decorrente dessa limitação;
      </p>

      <p>
        10.5. Esta isenção de responsabilidade se aplica a todos e quaisquer
        danos ou prejuízos, incluindo aqueles causados por qualquer falha de
        desempenho, erro, omissão, interrupção, apagamento, defeito, atraso na
        operação ou transmissão, vírus de computador, falha de linha de
        comunicação, roubo, destruição ou acesso não autorizado, a alteração ou
        uso de qualquer bem, seja por violação de contrato, comportamento
        ilícito, negligência ou qualquer outra causa de ação.
      </p>

      <p class="content-title">
        <b>11 - Responsabilidade por informações de terceiros:</b>
      </p>

      <p>
        11.1. A disposição através da aplicação de links e referências para
        outros sites, publicações ou recursos de informação não constitui o
        endosso desses sites ou de seus recursos por parte do "BARRACÃO
        DIGITAL": de seus agentes ou representantes;
      </p>

      <p>
        11.2. A equipe do "BARRACÃO DIGITAL" não faz representações ou asserções
        quanto à qualidade, conteúdo e precisão das informações, serviços ou
        produtos que podem ser fornecidas por esses recursos e especificamente
        se isenta de quaisquer garantias, incluindo, mas não limitando às
        garantias implícitas ou expressas de comerciabilidade ou adequação para
        qualquer utilização particular, aplicação ou finalidade.
      </p>

      <p class="content-title">
        <b>12 - Considerações finais:</b>
      </p>

      <p>
        12.1. O acesso ao serviço representa a aceitação expressa e irrestrita
        dos Termos de Uso acima descritos. Ao concordar com esses termos você
        concede uma licença perpétua, isenta de royalties, licença incondicional
        para o "BARRACÃO DIGITAL", Ministério da Saúde e todas as instituições
        ou estudos que tratam da saúde, para publicar a sua contribuição de
        forma agregada, nunca individualizada, na própria aplicação, bem como
        divulgá-las aos serviços de vigilância em saúde pública relacionados.
        Você também concorda que o "BARRACÃO DIGITAL" tem o direito, mas não a
        obrigação, de editar ou remover qualquer contribuição a critério
        exclusivo da sua equipe;
      </p>

      <p>
        12.2. Esta plataforma não realiza diagnóstico clínico, apenas auxilia o
        usuário na compreensão dos sinais e sintomas relacionados às definições
        operacionais, de saúde pública, para investigação do coronavírus na sua
        comunidade;
      </p>

      <p>
        12.3. É importante ressaltar que no caso da composição de sinais e
        sintomas, associados aos critérios epidemiológicos indique que o usuário
        possa ser um possível caso suspeito, isso não se trata de um
        diagnóstico. O Ministério da Saúde orienta que o mesmo deverá procurar
        atendimento em uma unidade de saúde mais próxima para avaliação clínica,
        ao que o “BARRACÃO DIGITAL” adere.
      </p>

      <p>
        12.4 Esta plataforma viabiliza o uso da Telemedicina em conformidade às
        leis brasileiras. A gratuidade e disponibilidade da plataforma depende
        dos recursos de seus mantenedores, parceiros e doadores. Caso queira se
        tornar um apoiador do projeto, entre em contato com
        <a href="mailto:faleconosco@barracaodigital.com" target="_top"
          >faleconosco@barracaodigital.com</a
        >
      </p>
    </v-card-text>

    <v-card-actions class="justify-center">
      <v-btn
        ref="acceptConcentBtn"
        color="primary"
        x-large
        @click.native="acceptConsent"
      >
        Aceitar e continuar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'PatientTerms',
  data: () => ({
    scrollPosition: window.scrollY,
  }),
  computed: {
    shouldDisplayGoToEndButton() {
      return this.scrollPosition < 300
    },
  },
  created() {
    // eslint-disable-next-line nuxt/no-globals-in-created
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    acceptConsent() {
      this.$cookie.set('consent-accepted', true, 360)
      this.$emit('accepted')
    },

    handleScroll() {
      this.scrollPosition = window.scrollY
    },
  },
}
</script>

<style scoped>
#go-to-end-btn {
  position: fixed;
  left: 50%;
  transform: translate(-50%, 0);
  bottom: 0;
  margin-bottom: 1em;
  opacity: 0.5;
}

#go-to-end-btn:hover {
  opacity: 1;
}
</style>
