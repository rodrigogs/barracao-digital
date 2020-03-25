<template>
  <section class="section">
    <div class="container">
      <h4 style="margin-top: 0">Contato</h4>
      <p style="text-align: center">É como um médico irá falar com você. Coloque somente contatos que você tem acesso imediato!</p>

      <form class="pacient-sign-up__form" id="patientSignUpForm " novalidate>
        <div class="field">
          <label class="label" for="phone">Telefone - Obrigatório</label>
          <input  @input="onPhoneInputChange" :class="{'error': errors.phone }" v-model="form.phone" name="phone" id="phone" class="input" type="text" placeholder="DDD e somente números" maxlength="15">
          <span v-if="errors.phone" class="error">{{errors.phone}}</span>
        </div>

        <div class="field">
          <label class="label" for="email">Email</label>
          <input :class="{'error': errors.email }" v-model="form.email" name="email" id="email" class="input" type="text" placeholder="seuemail@email.com" maxlength="255">
          <span v-if="errors.email" class="error">{{errors.email}}</span>
        </div>

        <div class="field">
          <label class="label" for="whatsapp">Whatsapp</label>
          <input @input="onWhatsappInputChange" :class="{'error': errors.whatsapp }" v-model="form.whatsapp" name="whatsapp" id="whatsapp" class="input" type="text" placeholder="DDD e somente números" maxlength="255">
          <span v-if="errors.whatsapp" class="error">{{errors.whatsapp}}</span>
        </div>

        <div class="field">
          <label class="label" for="telegram">Telegram</label>
          <input @input="onTelegramInputChange" :class="{'error': errors.telegram }" v-model="form.telegram" name="telegram" id="telegram" class="input" type="text" placeholder="DDD e somente números" maxlength="255">
          <span v-if="errors.telegram" class="error">{{errors.telegram}}</span>
        </div>

        <div class="field">
          <label class="label" for="hangouts">Hangouts</label>
          <input :class="{'error': errors.hangouts }" v-model="form.hangouts" name="hangouts" id="hangouts" class="input" type="text" placeholder="Email" maxlength="255">
          <span v-if="errors.hangouts" class="error">{{errors.hangouts}}</span>
        </div>

        <div class="field">
          <label class="label" for="skype">Skype</label>
          <input :class="{'error': errors.skype }" v-model="form.skype" name="skype" id="skype" class="input" type="text" placeholder="Nome no Skype">
          <span v-if="errors.skype" class="error">{{errors.skype}}</span>
        </div>
      </form>
    </div>
  </section>
</template>

<script>
import utils from '../utils';

export default {
  name: 'StepThree',
  components: {},
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
    };
  },
  methods: {
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

          this.$store.commit('patientSignUp/setStepFields', this.form);
          this.$emit('can-continue', { value: true });
        }, 300);
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
