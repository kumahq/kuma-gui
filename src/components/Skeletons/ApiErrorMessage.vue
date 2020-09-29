<template>
  <KEmptyState
    class="global-api-status"
    cta-is-hidden
  >
    <template slot="title">
      <KIcon
        class="kong-icon--centered"
        color="var(--yellow-300)"
        icon="warning"
        size="64"
      />
      Unable to reach the {{ tagline }} API
    </template>
    <template slot="message">
      <p>
        Please make sure {{ tagline }} is up and running
        <span v-if="url">, and it is reachable at <code>{{ url }}</code></span>
      </p>
    </template>
  </KEmptyState>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    url () {
      return localStorage.getItem('kumaApiUrl') || null
    },
    ...mapGetters({
      tagline: 'getTagline'
    })
  }
}
</script>

<style lang="scss">
.global-api-status {
}
</style>
