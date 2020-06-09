<template>
  <v-text-field ref="input" :value="value" label="Pesquisar" @input="onInput">
    <template v-slot:append>
      <slot name="append"></slot>
    </template>
  </v-text-field>
</template>

<script>
export default {
  name: 'DoctorWorklistFiltersOptions',
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  methods: {
    onInput(value) {
      this.$emit('input', value)
    },
  },
}
</script>
