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
        Please make sure Kuma is up and running
        <span v-if="url">, and it is reachable at <code>{{ url }}</code></span>
      </p>
    </template>
  </KEmptyState>
</template>

<script>
export default {
  computed: {
    url () {
      return localStorage.getItem('kumaApiUrl') || null
    }
  }
}
</script>

<style lang="scss">
.global-api-status {
}
</style>
