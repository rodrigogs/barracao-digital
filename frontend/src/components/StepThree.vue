<template>
  <section class="section">
    <div class="container">
      <h4 style="margin-top: 0; text-align: center;">Contato</h4>
      <p style="text-align: center">É como um médico irá falar com você. Coloque somente contatos que você tem acesso imediato!</p>

      <v-form class="pacient-sign-up__form" id="patientSignUpForm " novalidate>

        <v-text-field
          id="phone"
          name="phone"
          v-model="form.phone"
          :rules="rules.phone"
          maxlength="255"
          label="Telefone"
          required
          hint="Número com o DDD"
          v-mask="'(##) #####-####'"
        ></v-text-field>

        <v-text-field
          id="email"
          name="email"
          v-model="form.email"
          :rules="rules.email"
          maxlength="255"
          label="Email"
          required
          hint="seuemail@email.com"
        ></v-text-field>

        <v-text-field
          id="whatsapp"
          name="whatsapp"
          v-model="form.whatsapp"
          :rules="rules.whatsapp"
          maxlength="255"
          label="Whatsapp"
          required
          hint="Número com o DDD"
          v-mask="'(##) #####-####'"
        ></v-text-field>

        <v-text-field
          id="telegram"
          name="telegram"
          v-model="form.telegram"
          :rules="rules.telegram"
          maxlength="255"
          label="Telegram"
          required
          hint="Número com o DDD"
          v-mask="'(##) #####-####'"
        ></v-text-field>

        <v-text-field
          id="hangouts"
          name="hangouts"
          v-model="form.hangouts"
          :rules="rules.hangouts"
          maxlength="255"
          label="Hangouts"
          required
          hint="Email da Google"
        ></v-text-field>

        <v-text-field
          id="skype"
          name="skype"
          v-model="form.skype"
          :rules="rules.skype"
          maxlength="255"
          label="Skype"
          required
          hint="Usuário do Skype"
        ></v-text-field>

      </v-form>
    </div>
  </section>
</template>

<script>
import { mask } from 'vue-the-mask';
import utils from '../utils';

export default {
  name: 'StepThree',
  directives: { mask },
  props: ['clickedNext', 'currentStep'],
  data() {
    return {
      form: {
        phone: '',
        email: '',
        whatsapp: '',
        telegram: '',
        hangouts: '',
        skype: '',
      },
      errors: {},
      rules: {
        phone: [
          (v) => !!v || 'O telefone é obrigatório',
          (v) => v.length === 15 || 'Número inválido',
        ],
        email: [(v) => !v || utils.isEmailValid(v) || 'Email inválido'],
        whatsapp: [(v) => !v || v.length === 15 || 'Número inválido'],
        telegram: [(v) => !v || v.length === 15 || 'Número inválido'],
        hangouts: [(v) => !v || utils.isEmailValid(v) || 'Email inválido'],
        skype: [],
      },
    };
  },
  methods: {
    allRequiredFieldsFilled() {
      return this.form.phone;
    },
    isStepThreeValid() {
      let isValid = true;

      this.$delete(this.errors, 'phone');
      if (!this.form.phone) {
        this.$set(this.errors, 'phone', 'Telefone é obrigatório');
        isValid = false;
      }

      this.$delete(this.errors, 'email');
      if (this.form.email) {
        if (!utils.isEmailValid(this.form.email)) {
          this.$set(this.errors, 'email', 'Email inválido');
          isValid = false;
        }
      }

      this.$delete(this.errors, 'hangouts');
      if (this.form.hangouts) {
        if (!utils.isEmailValid(this.form.hangouts)) {
          this.$set(this.errors, 'hangouts', 'Email inválido');
          isValid = false;
        }
      }

      return isValid;
    },
    onPhoneInputChange(e) {
      this.form.phone = utils.phoneMask(e);
    },
    onWhatsappInputChange(e) {
      this.form.whatsapp = utils.phoneMask(e);
    },
    onTelegramInputChange(e) {
      this.form.telegram = utils.phoneMask(e);
    },
  },
  watch: {
    form: {
      handler(newForm, oldForm) {
        this.$emit('can-continue', { value: false });
        utils.debounce(() => {
          if (!this.isStepThreeValid()) {
            this.$emit('can-continue', { value: false });
            return;
          }

          this.$store.dispatch('patients/setStepFields', this.form)
            .then(this.$emit('can-continue', { value: true }));
        }, 300);
      },
      deep: true,
    },
  },
  mounted() {
    if (this.allRequiredFieldsFilled() && this.isStepThreeValid()) {
      this.$emit('can-continue', { value: true });
    }
  },
};
</script>
