<template>
  <section class="section">
    <div class="container">
      <h4 style="margin-top: 0; text-align: center;">Seus dados</h4>
      <p style="text-align: center">Preencha seus dados para direcionarmos seu atendimento</p>

      <v-form ref="form" class="pacient-sign-up__form" id="patientSignUpForm" novalidate>

        <v-text-field
          id="name"
          name="name"
          v-model="form.name"
          :rules="rules.name"
          maxlength="255"
          label="Nome"
          required
          hint="Exemplo: José da Silva"
        ></v-text-field>

        <v-text-field
          id="age"
          name="age"
          v-model="form.age"
          :rules="rules.age"
          label="Idade"
          required
          v-mask="'###'"
          hint="Exemplo: 60"
        ></v-text-field>

        <v-text-field
          id="cep"
          name="cep"
          v-model="form.cep"
          :rules="rules.cep"
          label="CEP"
          required
          v-mask="'#####-###'"
          :masked="true"
          hint="Digite somente números"
        ></v-text-field>

        <p style="margin-bottom: 0">
          Caso não saiba seu CEP, <a href="http://www.buscacep.correios.com.br/sistemas/buscacep/BuscaCepEndereco.cfm" target="_blank">clique aqui</a>
        </p>
      </v-form>
    </div>
  </section>
</template>

<script>
import { mask } from 'vue-the-mask';
import utils from '../utils';

export default {
  name: 'StepOne',
  props: ['clickedNext', 'currentStep'],
  directives: { mask },
  data() {
    return {
      form: {
        name: '',
        age: '',
        cep: '',
      },
      rules: {
        name: [
          (v) => !!v || 'O nome é obrigatório',
          (v) => v.length > 2 || 'O nome deve ter no mínimo 2 caracteres',
        ],
        age: [
          (v) => !!v || 'A idade é obrigatória',
          (v) => (v > 0 && v <= 125) || 'A idade não pode ser maior do que 125 anos',
        ],
        cep: [
          (v) => !!v || 'O CEP é obrigatório',
          (v) => v.length === 9 || 'O CEP deve ter 8 caracteres',
        ],
      },
    };
  },
  methods: {
    allRequiredFieldsFilled() {
      return this.form.name && this.form.age && this.form.cep;
    },
  },
  watch: {
    form: {
      handler(newForm, oldForm) {
        this.$emit('can-continue', { value: false });
        utils.debounce(() => {
          if (this.allRequiredFieldsFilled()) {
            if (!this.$refs.form.validate()) {
              this.$emit('can-continue', { value: false });
              return;
            }

            this.$store.dispatch('patients/setStepFields', this.form)
              .then(this.$emit('can-continue', { value: true }));
          }
        }, 300);
      },
      deep: true,
    },
  },
  mounted() {
    if (this.allRequiredFieldsFilled() && this.$refs.form.validate()) {
      this.$emit('can-continue', { value: true });
    }
  },
};
</script>
