<template>
  <v-autocomplete
    :id="id"
    :value="value"
    :name="name"
    :error-messages="errorMessages"
    :items="brazillianStates"
    :label="label"
    clearable
    item-text="name"
    item-value="fu"
    autocomplete="no"
    @input="updateValue"
  >
    <template v-slot:selection="data">
      <v-chip small :input-value="data.selected" @click="data.select">
        <v-avatar left size="20">
          <v-img :src="data.item.flagLink" />
        </v-avatar>
        {{ data.item.name }}
      </v-chip>
    </template>

    <template v-slot:item="data">
      <v-list-item-avatar size="20">
        <img :src="data.item.flagLink" />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>{{ data.item.name }}</v-list-item-title>
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>

<script>
import states from '~/enums/states'

export default {
  name: 'StatesAutocomplete',
  props: {
    value: {
      type: String,
      default: '',
      required: false
    },
    errorMessages: {
      type: Array,
      default() {
        return []
      },
      required: false
    },
    name: {
      type: String,
      default: '',
      required: false
    },
    id: {
      type: String,
      default: '',
      required: false
    },
    label: {
      type: String,
      default: '',
      required: false
    }
  },
  computed: {
    brazillianStates() {
      return states.brazil
    }
  },
  methods: {
    updateValue(...args) {
      this.$emit('input', ...args)
    }
  }
}
</script>
