<template>
  <v-form ref="form" id="doctor-form" v-on:submit.prevent="submit" autocomplete="off">
    <v-row>
      <v-col cols="3">
        <v-autocomplete
          id="fu"
          name="fu"
          v-model="form.fu"
          :rules="rules.fu"
          :items="brazillianStates"
          label="Estado"
          item-text="name"
          item-value="fu"
          clearable
          autocomplete="no"
        >
          <template v-slot:selection="data">
            <v-chip
              :input-value="data.selected"
              @click="data.select"
            >
              <v-avatar left size="20">
                <v-img :src="data.item.flagLink"/>
              </v-avatar>
                                 {{ data.item.name }}
            </v-chip>
          </template>

          <template v-slot:item="data">
            <v-list-item-avatar size="20">
              <img :src="data.item.flagLink"/>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-html="data.item.name"/>
            </v-list-item-content>
          </template>
        </v-autocomplete>
      </v-col>

      <v-col cols="3">
        <v-text-field
          id="crm"
          name="crm"
          v-model="form.crm"
          :rules="rules.crm"
          label="CRM"
          required
          :loading="isRetrievingCrmInfo"
        ></v-text-field>
      </v-col>

      <v-col cols="3">
        <v-text-field
          id="specialty"
          name="specialty"
          v-model="form.specialty"
          :rules="rules.specialty"
          label="Especialidade"
          readonly
          required
        ></v-text-field>
      </v-col>

      <v-col cols="3">
        <v-text-field
          id="name"
          name="name"
          v-model="form.name"
          :rules="rules.name"
          label="Nome"
          autocomplete="no"
          readonly
          required
        ></v-text-field>
      </v-col>

      <v-col cols="3">
        <v-text-field
          id="username"
          name="username"
          v-model="form.username"
          :rules="rules.username"
          label="Nome de usuário"
          required
          :readonly="isEditing"
          ref="usernameInput"
        ></v-text-field>
      </v-col>

      <v-col cols="3">
        <v-text-field
          id="password"
          name="password"
          v-model="form.password"
          :rules="rules.password"
          label="Senha"
          type="password"
          autocomplete="new_password"
          required
        ></v-text-field>
      </v-col>

      <v-col cols="3">
        <v-text-field
          id="email"
          name="email"
          v-model="form.email"
          :rules="rules.email"
          label="Email"
          type="email"
          autocomplete="no"
          required
        ></v-text-field>
      </v-col>

      <v-col cols="3">
        <v-text-field
          id="cep"
          name="cep"
          v-model="form.cep"
          :rules="rules.cep"
          label="CEP da instalação"
          autocomplete="no"
          required
          v-mask="'#####-###'"
        ></v-text-field>
      </v-col>

      <v-col cols="3">
        <v-switch
          id="admin"
          name="admin"
          v-model="form.admin"
          label="Admin?"
        ></v-switch>
      </v-col>

      <v-col cols="3">
        <v-switch
          id="master"
          name="master"
          v-model="form.master"
          label="Master?"
        ></v-switch>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-btn color="primary" class="mr-2" type="submit" :disabled="!isValidCrm" :loading="isLoading">Salvar</v-btn>
        <v-btn color="error" class="mr-2" @click.prevent="cancel">Cancelar</v-btn>
      </v-col>
    </v-row>

    </v-form>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { mask } from 'vue-the-mask';
import isEmailValid from '@/utils/isEmailValid';
import states from '@/utils/states';
import crmUtil from '@/utils/crm';
import debounce from '@/utils/debounce';

export default {
  name: 'DoctorForm',

  directives: { mask },

  props: {
    doctor: {
      type: Object,
      required: false,
    },
    isLoading: {
      type: Boolean,
      required: true,
    },
  },

  async mounted() {
    this.form = { cep: this.loggedUser.cep, ...this.form };
  },

  data() {
    return {
      form: {
        ...this.doctor,
      },
      rules: {
        name: [
          (v) => !!v || 'O nome é obrigatório',
          (v) => (!!v && v.length >= 3) || 'O nome deve ter no mínimo 3 caracteres',
        ],
        username: [
          (v) => !!v || 'O nome de usuário é obrigatório',
          (v) => (!!v && v.length >= 3) || 'O nome de usuário deve ter no mínimo 3 caracteres',
        ],
        password: [
          (v) => !!v || 'A senha é obrigatória',
          (v) => (!!v && v.length >= 5) || 'A senha deve ter no mínimo 5 caracteres',
        ],
        email: [
          (v) => !!v || 'O email é obrigatório',
          (v) => (!!v && isEmailValid(v)) || 'Email inválido',
        ],
        fu: [(v) => !!v || 'O estado é obrigatório'],
        crm: [(v) => !!v || 'O CRM é obrigatório'],
        cep: [(v) => !!v || 'O CEP da instalação é obrigátório'],
        specialty: [(v) => !!v || 'A especialidade é obrigatória'],
        admin: [],
        master: [],
      },
      isRetrievingCrmInfo: false,
      isValidCrm: false,
    };
  },

  computed: {
    ...mapGetters('auth', [
      'loggedUser',
    ]),

    brazillianStates() {
      return states.brazil;
    },

    cep: {
      get() {
        return this.form.cep || this.loggedUser.cep;
      },
      set(newCep) {
        this.form.cep = newCep;
      },
    },

    isEditing() {
      return !!this.doctor;
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

    populateFormInfo(newInfo) {
      this.form = { ...this.form, ...newInfo };
    },

    async retrieveCrmInfo() {
      try {
        this.isRetrievingCrmInfo = true;
        const { fu, crm } = this.form;
        return await crmUtil.retrieve(fu, crm);
      } finally {
        this.isRetrievingCrmInfo = false;
      }
    },

    updateCrmInfo: debounce(async function updateCrmInfo() {
      this.isValidCrm = false;

      const { isRetrievingCrmInfo, fu, crm } = this.form;
      if (isRetrievingCrmInfo || !fu || !crm || crm.length < 1) return;

      const crmInfo = await this.retrieveCrmInfo();
      if (!crmInfo) {
        this.$noty.error(`O CRM "${crm}" não foi encontrado na no estado "${this.brazillianStates.find((s) => s.fu === fu).name}"`);
      } else {
        const validationError = crmUtil.validate(crmInfo);
        if (validationError) {
          this.$noty.error(validationError);
        } else {
          this.isValidCrm = true;
          this.populateFormInfo({
            name: crmInfo.nome,
            specialty: crmInfo.especialidade,
          });
          this.$refs.usernameInput.focus();
        }
      }
    }, 800),
  },

  watch: {
    'form.crm': function formCrm() {
      this.updateCrmInfo();
    },

    'form.fu': function formState() {
      this.updateCrmInfo();
    },

    doctor(newValue) {
      this.form = { ...this.form, ...newValue };
    },
  },
};
</script>
