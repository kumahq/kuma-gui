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
        There was a problem trying to reach the Kuma API. Please try
        restarting Kuma.
      </p>
    </template>
  </KEmptyState>
</template>

<script>
export default {

}
</script>

<style lang="scss">
.global-api-status {
}
</style>
