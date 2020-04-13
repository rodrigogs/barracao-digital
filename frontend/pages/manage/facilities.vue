<template>
  <v-container fluid>
    <v-card elevation="0" append>
      <v-toolbar color="primary" flat dark dense>
        <v-toolbar-title>Lista de instalações</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn
          v-if="$auth.user.admin"
          icon
          title="Criar instalação"
          @click="create"
        >
          <v-icon>mdi-account-plus</v-icon>
        </v-btn>
      </v-toolbar>

      <v-divider />

      <v-data-table
        :loading="isLoading"
        :headers="headers"
        :items="facilities"
        item-key="origin"
        class="elevation-1"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="edit(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="remove(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>

      <mugen-scroll
        v-if="!isPaginationFinished"
        :handler="handleNextPageRequest"
        :should-handle="!isLoading"
      >
        <div class="block text-center mt-4">
          <v-progress-circular
            :size="30"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </div>
      </mugen-scroll>
    </v-card>

    <FacilitiesResourceModal
      v-if="selectedFacility"
      :facility="selectedFacility"
      :submit="facilitySaved"
    />
  </v-container>
</template>

<script>
import MugenScroll from 'vue-mugen-scroll'
import * as R from 'ramda'
import FacilitiesResourceModal from '~/components/manage/FacilitiesResourceModal'

const getAllFacilities = ($api, lastEvaluatedKey = '') =>
  $api.getAllFacilities(lastEvaluatedKey).then(
    ({ items = [], lastEvaluatedKey = '' }) => ({
      facilities: items,
      lastEvaluatedKey: lastEvaluatedKey || '',
      isPaginationFinished: !lastEvaluatedKey
    }),
    (error) => Promise.reject(error)
  )

export default {
  middleware: ['auth', 'isAdminOrMaster'],
  components: {
    MugenScroll,
    FacilitiesResourceModal
  },
  asyncData({ app, error }) {
    return getAllFacilities(app.$api).then(
      (response) => response,
      (err) => {
        const message = R.path(['response', 'data', 'message'], err) || err
        const statusCode = R.path(['response', 'status'], err) || 500
        error({ message, statusCode })
      }
    )
  },
  data: () => ({
    facilities: [],
    selectedFacility: null,
    lastEvaluatedKey: '',
    isPaginationFinished: false,
    isLoading: false,
    headers: [
      { text: 'CEP de origem', value: 'origin' },
      { text: 'Contato', value: 'contact' },
      { text: 'Tipo do contato', value: 'contactType' },
      { text: '', value: 'actions', sortable: false }
    ]
  }),
  methods: {
    handleNextPageRequest() {
      this.isLoading = true
      return getAllFacilities(this.$api, this.lastEvaluatedKey)
        .then(
          ({
            facilities = [],
            lastEvaluatedKey = '',
            isPaginationFinished = true
          }) => {
            this.facilities = R.uniq([...this.facilities, ...facilities])
            this.lastEvaluatedKey = lastEvaluatedKey
            this.isPaginationFinished = isPaginationFinished
          },
          () => {
            this.$toast.error(
              'Ocorreu um erro ao tentar consultar as instalações, tente novamente mais tarde'
            )
          }
        )
        .finally(() => {
          this.isLoading = false
        })
    },
    facilitySaved(result) {
      console.log(result)
    },
    create() {},
    edit(item) {
      this.selectedFacility = item
    },
    remove({ origin }) {
      if (!confirm(`Deletar a instalação ${origin}?`)) return
      this.isLoading = true
      const index = this.facilities.findIndex(
        (facility) => facility.origin === origin
      )

      return this.$api
        .deleteFacility(origin)
        .then(
          () => {
            this.$delete(this.facilities, index)
            this.$toast.success('Instalação removida com sucesso')
          },
          () =>
            this.$toast.error(
              'Ocorreu um erro ao tentar deletar esta instalação, tente novamente mais tarde'
            )
        )
        .finally(() => {
          this.isLoading = false
        })
    }
  }
}
</script>
