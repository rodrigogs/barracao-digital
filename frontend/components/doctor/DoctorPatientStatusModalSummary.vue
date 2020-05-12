<template>
  <div>
    <v-row>
      <v-col>
        <v-list dense>
          <v-subheader>Dados do paciente</v-subheader>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ patient.name }}</v-list-item-title>
              <v-list-item-subtitle>Nome</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>

      <v-col>
        <v-list dense>
          <v-subheader></v-subheader>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ patient.cpf }}</v-list-item-title>
              <v-list-item-subtitle>CPF</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-list dense>
          <v-subheader>Dados médicos</v-subheader>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-cake</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ patient.age }}</v-list-item-title>
              <v-list-item-subtitle>Idade</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item v-if="patient.meds">
            <v-list-item-icon>
              <v-icon>mdi-pill</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ patient.meds }}</v-list-item-title>
              <v-list-item-subtitle>Medicamentos</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item v-if="patient.allergies">
            <v-list-item-icon>
              <v-icon>mdi-allergy</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                {{ patient.allergies }}
              </v-list-item-title>
              <v-list-item-subtitle>Alergias</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item v-if="patient.covenant">
            <v-list-item-icon>
              <v-icon>mdi-hospital-building</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                {{ patient.covenant }}
              </v-list-item-title>
              <v-list-item-subtitle>Convênio</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-backup-restore</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                {{ patient.hasBeenAssisted ? 'Sim' : 'Não' }}
              </v-list-item-title>
              <v-list-item-subtitle>
                Já foi atendido anteriormente?
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>

      <v-col>
        <v-list dense>
          <v-subheader>Contatos</v-subheader>

          <v-list-item v-if="patient.phone">
            <v-list-item-icon>
              <v-icon>mdi-phone</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ patient.phone }}</v-list-item-title>
              <v-list-item-subtitle>Telefone</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item v-if="patient.email">
            <v-list-item-icon>
              <v-icon>mdi-email</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ patient.email }}</v-list-item-title>
              <v-list-item-subtitle>Email</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item v-if="patient.whatsapp">
            <v-list-item-icon>
              <v-icon>mdi-whatsapp</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                {{ patient.whatsapp }}
              </v-list-item-title>
              <v-list-item-subtitle>Whatsapp</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item v-if="patient.telegram">
            <v-list-item-icon>
              <v-icon>mdi-telegram</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                {{ patient.telegram }}
              </v-list-item-title>
              <v-list-item-subtitle>Telegram</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item v-if="patient.hangouts">
            <v-list-item-icon>
              <v-icon>mdi-google-hangouts</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                {{ patient.hangouts }}
              </v-list-item-title>
              <v-list-item-subtitle>Hangouts</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item v-if="patient.skype">
            <v-list-item-icon>
              <v-icon>mdi-skype</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ patient.skype }}</v-list-item-title>
              <v-list-item-subtitle>Skype</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'DoctorPatientStatusModalSummary',
  props: {
    patient: {
      type: Object,
      required: true
    }
  }
}
</script>
