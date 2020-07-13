<template>
  <v-dialog v-model="isOpen" max-width="800" @click:outside="close">
    <template v-slot:activator="dialogActivator">
      <v-tooltip bottom>
        <template v-slot:activator="tooltipActivator">
          <v-btn
            :style="hidden && { display: 'none' }"
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
        <v-btn icon @click="close">
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
  props: {
    open: {
      type: Boolean,
      required: false
    },
    hidden: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      dialog: !!this.open,
      interval: null,
      modalWidth: 0,
      modalHeight: 0
    }
  },
  computed: {
    isOpen() {
      return this.open || this.dialog
    }
  },
  watch: {
    isOpen() {
      if (this.isOpen) {
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
    close() {
      this.dialog = false
      this.$emit('close')
    },
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
