<template>

  <v-card>

    <v-card-text>
      <div class="patient-enqueued__lightweight-warn">
        Essa página é atualizada automaticamente a cada 1 minuto
      </div>

      <div class="patient-enqueued__big-warn patient-enqueued__big-warn--blue">
        Você está na fila de atendimento
      </div>

      <div class="patient-enqueued__text" style="width: 250px;">
        Fique com o telefone e suas formas de comunicação disponiveis e online.
        <br>
        <br>
        <strong>Assim que possível um médico entrará em contato com você.</strong>
      </div>

      <div class="patient-enqueued__small-text">
        Tempo na fila: {{ calcTimeWaiting(timePast) }}
      </div>

      <div class="patient-enqueued__big-warn patient-enqueued__big-warn--red">
        Sua senha de retorno é
        <br>
        <strong style="font-size: 28px;">{{ patient.ticket }}</strong>
      </div>

      <div class="patient-enqueued__text" style="width: 220px;">
        Caso você perca a conexão, retorne à fila de atendimento usando a senha acima.
      </div>
    </v-card-text>

  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import Kairos from 'kairos';
import Loader from '@/components/Loader.vue';

export default {
  name: 'PatientStatusWaiting',
  computed: {
    timePast() {
      return this.patient ? this.patient.createdAt : undefined;
    },
    ...mapGetters('patients', {
      patient: 'loggedInPatient',
    }),
  },
  methods: {
    calcTimeWaiting(createdAt) {
      const timeWaiting = Date.now() - createdAt;
      const time = Kairos.new(timeWaiting);
      return time.toString('hh:mm', true);
    },
  },
};
</script>
