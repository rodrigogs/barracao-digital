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

      <infinite-loading @infinite="handleNextPageRequest"></infinite-loading>
    </v-card>

    <FacilitiesResourceModal
      v-if="selectedFacility"
      :facility="selectedFacility"
      :submit="facilitySaved"
      @close="selectedFacility = null"
    />
  </v-container>
</template>

<script>
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
    isLoading: false,
    headers: [
      { text: 'CEP de origem', value: 'origin' },
      { text: 'Nome', value: 'name' },
      { text: 'Diretor técnico', value: 'techDirector' },
      { text: 'Contato', value: 'contact' },
      { text: '', value: 'actions', sortable: false }
    ]
  }),
  methods: {
    handleNextPageRequest($loadingState) {
      if (this.isPaginationFinished) return $loadingState.complete()

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
          this.isPaginationFinished
            ? $loadingState.complete()
            : $loadingState.loaded()
        })
    },
    async facilitySaved(isCreating, facility) {
      try {
        if (isCreating) {
          const newFacility = await this.$api.createFacility(facility)
          this.lastEvaluatedKey = ''
          await this.handleNextPageRequest()
          this.$toast.success('Instalação salva com sucesso')
          return Promise.resolve(newFacility)
        } else {
          await this.$api.updateFacility(this.selectedFacility.origin, facility)
          const index = this._findFacilityIndex(this.selectedFacility.origin)
          this.$set(this.facilities, index, facility)
          this.$toast.success('Instalação atualizada com sucesso')
          return Promise.resolve(facility)
        }
      } catch (error) {
        const message = R.path(['response', 'data', 'message'], error) || error
        this.$toast.error(message)
        return Promise.reject(error)
      }
    },
    create() {
      this.selectedFacility = {
        origin: '',
        contact: '',
        contactType: '',
        destination: []
      }
    },
    edit(item) {
      this.selectedFacility = item
    },
    remove({ origin }) {
      if (!confirm(`Deletar a instalação ${origin}?`)) return
      this.isLoading = true
      const index = this._findFacilityIndex(origin)

      if (index === -1) {
        this.$toast.error('Você não pode deletar esta instalação')
        return
      }

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
    },
    _findFacilityIndex(origin) {
      return this.facilities.findIndex((facility) => facility.origin === origin)
    }
  }
}
</script>
