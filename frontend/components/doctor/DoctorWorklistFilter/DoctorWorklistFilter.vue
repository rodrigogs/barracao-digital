<template>
  <v-container fluid class="ma-0 pa-0">
    <v-row justify="center" no-gutters>
      <v-col cols="12" sm="8">
        <DoctorWorklistFiltersSearchBar v-model="search" @input="updated">
          <template v-slot:append>
            <DoctorWorklistFiltersOptions v-model="options" @input="updated" />
          </template>
        </DoctorWorklistFiltersSearchBar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DoctorWorklistFiltersSearchBar from './DoctorWorklistFiltersSearchBar'
import DoctorWorklistFiltersOptions from './DoctorWorklistFiltersOptions'

export default {
  components: {
    DoctorWorklistFiltersSearchBar,
    DoctorWorklistFiltersOptions
  },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      search: '',
      options: {}
    }
  },
  methods: {
    updated() {
      this.$emit('input', { search: this.search, options: this.options })
    }
  }
}
</script>
