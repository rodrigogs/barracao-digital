<template>
  <v-form ref="form" id="facility-form" v-on:submit.prevent="submit" autocomplete="off">
    <v-row>

      <v-col cols="3">
        <v-text-field
          id="origin"
          name="origin"
          v-model="form.origin"
          :rules="rules.origin"
          label="CEP de origem"
          v-mask="'#####-###'"
          required
        ></v-text-field>
      </v-col>

      <v-col cols="3">
        <v-text-field
          id="contact"
          name="contact"
          v-model="form.contact"
          :rules="rules.contact"
          label="Contato"
          required
        ></v-text-field>
      </v-col>

      <v-col cols="3">
        <v-text-field
          id="contactType"
          name="contactType"
          v-model="form.contactType"
          :rules="rules.contactType"
          label="Tipo do contato"
          required
        ></v-text-field>
      </v-col>

    </v-row>

    <v-row>
      <v-col cols="12">
        <v-combobox
          v-model="form.destinations"
          label="CEPS de destino"
          multiple
          small-chips
          deletable-chips
        ></v-combobox>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-btn color="primary" class="mr-2" type="submit" :loading="isLoading">Salvar</v-btn>
        <v-btn color="error" class="mr-2" @click.prevent="cancel">Cancelar</v-btn>
      </v-col>
    </v-row>

    </v-form>
</template>

<script>
import { mask } from 'vue-the-mask';

export default {
  name: 'FacilityForm',

  directives: { mask },

  props: {
    facility: {
      type: Object,
      required: false,
    },
    isLoading: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      form: {
        ...this.facility,
      },
      rules: {
        origin: [(v) => !!v || 'O CEP de origem é obrigátório'],
        contact: [(v) => !!v || 'O contato é obrigatório'],
        contactType: [(v) => !!v || 'O tipo do contato é obrigatório'],
        destinations: [],
      },
    };
  },

  computed: {
    isEditing() {
      return !!this.facility;
    },
  },

  methods: {
    submit() {
      if (!this.$refs.form.validate()) return;
      this.$emit('submit', this.form);
    },

    cancel() {
      this.$emit('cancel');
    },
  },

  watch: {
    facility(newValue) {
      this.form = { ...this.form, ...newValue };
    },
  },
};
</script>
