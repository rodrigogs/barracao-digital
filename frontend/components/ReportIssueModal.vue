<template>
  <v-dialog v-model="dialog" max-width="800">
    <template v-slot:activator="dialogActivator">
      <v-tooltip bottom>
        <template v-slot:activator="tooltipActivator">
          <v-btn
            icon
            color="warning"
            v-on="tooltipActivator.on"
            @click="dialogActivator && (dialog = true)"
          >
            <v-icon>mdi-alert-circle-outline</v-icon>
          </v-btn>
        </template>
        <span>Reportar problema</span>
      </v-tooltip>
    </template>
    <v-card ref="modal">
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
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
    dialog: false,
    interval: null,
    modalWidth: 0,
    modalHeight: 0
  }),
  watch: {
    dialog() {
      if (this.dialog) {
        this.startUpdatingModalSize()
      } else {
        this.stopUpdatingModalSize()
      }
    }
  },
  destroyed() {
    this.stopUpdatingModalSize()
  },
  methods: {
    startUpdatingModalSize() {
      this.interval = setInterval(() => this.updateModalSize(), 1000)
    },
    stopUpdatingModalSize() {
      this.interval && clearInterval(this.interval)
    },
    updateModalSize() {
      this.modalHeight = this.$refs.modal.$el.clientHeight
      this.modalWidth = this.$refs.modal.$el.clientWidth
    }
  }
}
</script>
