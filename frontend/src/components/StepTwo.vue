<template>
  <div class="container">
    <h4 style="margin-top: 0">Informações médicas</h4>
    <p style="text-align: center">Informe sobre sua situação médica</p>

    <form class="pacient-sign-up__form" id="pacientSignUpForm " novalidate>
      <div class="field">
        <label class="label" for="meds">Usa algum medicamento? Qual?</label>
        <textarea :class="{'error': errors.meds }" v-model="form.meds" name="meds" id="meds" class="input" type="text" placeholder="Exemplo: Paracetamol, Ibuprofeno" maxlength="255"></textarea>
        <p v-if="errors.meds" class="error">{{errors.meds}}</p>
      </div>

      <div class="field">
        <label class="label" for="allergies">Possuí alergias? Quais?</label>
        <textarea :class="{'error': errors.allergies }" v-model="form.allergies" name="allergies" id="allergies" class="input" type="text" placeholder="Exemplo: Leite, Ovo, Nozes" maxlength="255"></textarea>
        <p v-if="errors.allergies" class="error">{{errors.allergies}}</p>
      </div>

      <div class="field">
        <label class="label" for="covenant">Possuí convênio? Qual?</label>
        <input :class="{'error': errors.covenant }" v-model="form.covenant" name="covenant" id="covenant" class="input" type="text" placeholder="Cite seu convênio" maxlength="255">
        <p v-if="errors.covenant" class="error">{{errors.covenant}}</p>
      </div>

      <div class="field">
        <label class="label">Ja foi atendido pelo Barracão Digital antes?</label>
        <div class="field__radio-group">
          <label class="radio" for="has_been_assisted_yes">
            <input type="radio" name="has_been_assisted_yes" v-model="form.has_been_assisted" :value="true" id="has_been_assisted_yes">
            Sim
          </label>
          <label class="radio" for="has_been_assisted_no">
            <input type="radio" name="has_been_assisted_no" v-model="form.has_been_assisted" :value="false" id="has_been_assisted_no">
            Não
          </label>
        </div>
        <p v-if="errors.has_been_assisted" class="error">{{errors.has_been_assisted}}</p>
      </div>
    </form>
  </div>
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
        has_been_assisted: false,
      },
      errors: {},
    };
  },
  watch: {
    form: {
      handler(newForm, oldForm) {
        this.$emit('can-continue', { value: false });
        utils.debounce(() => {
          this.$store.commit('pacientSignUp/setStepFields', this.form);
          this.$emit('can-continue', { value: true });
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
