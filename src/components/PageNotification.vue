<template>
  <KToaster
    :is-visible="isVisible"
    :appearance="notification.type"
    :message="notification.message"
    :timeout-milliseconds="notification.timeoutMilliseconds"
    @close="closeToaster"
  />
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'PageNotification',

  props: {
    notification: {
      type: Object,
      default: () => ({
        active: false,
        type: '',
        variant: '',
        message: '',
        link: null,
        timeoutMilliseconds: 4000,
      }),
    },
  },

  data() {
    return {
      isVisible: false,
    }
  },

  created() {
    this.$nextTick(() => {
      this.isVisible = true
    })
  },

  methods: {
    closeToaster() {
      this.isVisible = false

      setTimeout(() => {
        this.handleDismiss()
      }, 300) // wait for animation duration
    },

    ...mapActions({
      handleDismiss: 'dismissNotification',
    }),
  },
}
</script>
