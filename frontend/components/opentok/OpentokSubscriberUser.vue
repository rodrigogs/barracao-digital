<template>
  <div></div>
</template>

<script>
import OT from '@opentok/client'

export default {
  name: 'OpentokSubscriberUser',
  props: {
    stream: {
      type: OT.Stream,
      required: true
    },
    session: {
      type: OT.Session,
      required: true
    },
    opts: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },
  mounted() {
    const subscriber = this.session.subscribe(
      this.stream,
      this.$el,
      this.opts,
      (err) => {
        if (err) {
          this.$emit('error', err)
        } else {
          this.$emit('subscriberConnected', subscriber)
        }
      }
    )
    this.$emit('subscriberCreated', subscriber)
  }
}
</script>
