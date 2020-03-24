<template>
  <div class="container">
    <h4 style="margin-top: 0">Seus dados</h4>
    <p style="text-align: center">Preencha seus dados para direcionarmos seu atendimento</p>
    <form class="pacient-sign-up__form" id="pacientSignUpForm " novalidate>
      <div class="field">
        <label class="label" for="name">Nome - Obrigatório</label>
        <input :class="{'is-danger': errors.name }" v-model="form.name" name="name" id="name" class="input" type="text" placeholder="Exemplo: José da Silva">
        <p v-if="errors.name" class="error">{{errors.name}}</p>
      </div>

      <div class="field">
        <label class="label" for="age">Idade - Obrigatório</label>
        <input @input="onAgeInputChange" :class="{'is-danger': errors.age }" v-model="form.age" name="age" id="age" class="input" type="text" placeholder="Exemplo: 60" maxlength="3">
        <p v-if="errors.age" class="error">{{errors.age}}</p>
      </div>

      <div class="field">
        <label class="label" for="cep">CEP - Obrigatório</label>
        <input @input="onCEPInputChange" :class="{'is-danger': errors.cep }" v-model="form.cep" name="cep" id="cep" class="input" type="text" placeholder="Digite somente números" maxlength="9">
        <p v-if="errors.cep" class="error">{{errors.cep}}</p>
      </div>

      <p>
        Caso não saiba seu CEP, <a href="http://www.buscacep.correios.com.br/sistemas/buscacep/BuscaCepEndereco.cfm">clique aqui</a>
      </p>
    </form>
  </div>
</template>

<script>

export default {
  name: 'StepOne',
  components: {},
  props: ['clickedNext', 'currentStep'],
  data() {
    return {
      form: {
        name: '',
        age: '',
        cep: '',
      },
      errors: {},
    };
  },
  methods: {
    allFieldsFilled() {
      return this.form.name && this.form.age && this.form.cep;
    },
    isStepOneValid() {
      let isValid = true;

      this.$delete(this.errors, 'name');
      if (!this.form.name) {
        this.$set(this.errors, 'name', 'Nome é obrigatório');
        isValid = false;
      }

      this.$delete(this.errors, 'age');
      if (!this.form.age) {
        this.$set(this.errors, 'age', 'Idade é obrigatório');
        isValid = false;
      } else if (this.form.age < 0 && this.form.age > 120) {
        this.$set(this.errors, 'age', 'Idade deve estar entre 0 e 120 anos');
        isValid = false;
      }

      this.$delete(this.errors, 'cep');
      if (!this.form.cep) {
        this.$set(this.errors, 'cep', 'CEP é obrigatório');
        isValid = false;
      } else if (!this.isCEPValid(this.form.cep)) {
        this.$set(this.errors, 'email', 'CEP inválido');
        isValid = false;
      }

      return isValid;
    },
    isCEPValid(cep) {
      const cepER = /^[0-9]{5}-[0-9]{3}$/;
      return cepER.test(cep);
    },
    onCEPInputChange(e) {
      let x = e.target.value;
      x = x.replace(/\D/g, '');
      x = x.replace(/(\d)(\d{3})$/, '$1-$2');

      this.form.cep = x;
    },
    onAgeInputChange(e) {
      let x = e.target.value;
      x = x.replace(/\D/g, '');
      x = x.replace(/(\d)$/, '$1');

      this.form.age = x;
    },
  },
  watch: {
    form: {
      handler(newForm, oldForm) {
        if (this.allFieldsFilled()) {
          if (!this.isStepOneValid()) {
            this.$emit('can-continue', { value: false });
            return;
          }

          this.$store.commit('pacientSignUp/setStepFields', this.form);
          this.$emit('can-continue', { value: true });
        }
      },
      deep: true,
    },
  },
  mounted() {
    if (this.allFieldsFilled() && this.isStepOneValid()) {
      this.$emit('can-continue', { value: true });
    }
  },
};
</script>
