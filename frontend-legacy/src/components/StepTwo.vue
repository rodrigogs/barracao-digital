<template>
  <section class="section">
    <div class="container">
      <h4 style="margin-top: 0;text-align: center;">Informações médicas</h4>
      <p style="text-align: center">Informe sobre sua situação médica</p>

      <v-form class="pacient-sign-up__form" id="patientSignUpForm " novalidate>

        <v-textarea
          v-model="form.meds"
          name="meds"
          id="meds"
          maxlength="255"
          label="Você faz uso de algum remédio todos os dias? Quais?"
          hint="Exemplo: Enalapril, Metformina, AAS"
          outlined
          rows="1"
        ></v-textarea>

        <v-textarea
          v-model="form.allergies"
          name="allergies"
          id="allergies"
          maxlength="255"
          label="Você tem alguma alergia? Quais?"
          hint="Exemplo: Dipirona, Penicilina, Paracetamol"
          outlined
          rows="1"
        ></v-textarea>

        <v-textarea
          v-model="form.covenant"
          name="covenant"
          id="covenant"
          maxlength="255"
          label="Você tem algum convênio de saúde? Qual?"
          hint="Cite seu convênio"
          outlined
          rows="1"
        ></v-textarea>

        <label class="label">Já foi atendido pelo Barracão Digital antes?</label>
        <v-radio-group
          v-model="form.hasBeenAssisted"
          id="hasBeenAssisted"
          name="hasBeenAssisted"
          row
        >
          <v-radio label="Sim" :value="true"></v-radio>
          <v-radio label="Não" :value="false"></v-radio>
        </v-radio-group>

      </v-form>
    </div>
  </section>
</template>

<script>
import utils from '../utils';

export default {
  name: 'StepTwo',
  components: {},
  props: ['clickedNext', 'currentStep'],
  data() {
    return {
      form: {
        meds: '',
        allergies: '',
        covenant: '',
        hasBeenAssisted: false,
      },
      errors: {},
    };
  },
  watch: {
    form: {
      handler(newForm, oldForm) {
        this.$emit('can-continue', { value: false });
        utils.debounce(() => {
          this.$store.dispatch('patients/setStepFields', this.form)
            .then(this.$emit('can-continue', { value: true }));
        }, 300);
      },
      deep: true,
    },
  },
  mounted() {
    this.$emit('can-continue', { value: true });
  },
};
</script>
