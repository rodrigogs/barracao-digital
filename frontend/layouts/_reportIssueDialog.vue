<template>
  <v-dialog :value="true" max-width="800" @click:outside="$emit('close')">
    <v-card ref="modal">
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-actions>
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSc4X6l3exF_AkR8AHu5G1KhTi9eflfYD_PNRH3Qc8__oO9mIA/viewform?embedded=true"
        :width="modalWidth"
        height="1000"
        frameborder="0"
        marginheight="0"
        marginwidth="0"
        >Carregando…</iframe
      >
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    interval: null,
    modalWidth: 0,
    modalHeight: 0
  }),
  mounted() {
    this.interval = setInterval(() => this.updateModalSize(), 1000)
  },
  destroyed() {
    this.interval && clearInterval(this.interval)
  },
  methods: {
    updateModalSize() {
      this.modalHeight = this.$refs.modal.$el.clientHeight
      this.modalWidth = this.$refs.modal.$el.clientWidth
    }
  }
}
</script>
