<template>
  <KEmptyState
    class="global-api-status"
    cta-is-hidden
  >
    <template slot="title">
      <KIcon
        class="kong-icon--centered"
        color="var(--yellow-base)"
        icon="warning"
        size="64"
      />
      Unable to reach the Kuma API
    </template>
    <template slot="message">
      <p>
        Please make sure Kuma is up and running, and it is reachable at
        <code>{{ url }}</code>
      </p>
    </template>
  </KEmptyState>
</template>

<script>
export default {
  computed: {
    url () {
      return process.env.VUE_APP_KUMA_CONFIG
    }
  }
}
</script>

<style lang="scss">
.global-api-status {
}
</style>
