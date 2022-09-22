<template>
  <KEmptyState
    class="global-api-status empty-state--wide-content empty-state--compact"
    cta-is-hidden
  >
    <template #title>
      <KIcon
        class="kong-icon--centered"
        icon="warning"
        color="var(--black-75)"
        secondary-color="var(--yellow-300)"
        size="64"
      />

      <p>Unable to reach the API</p>
    </template>

    <template #message>
      <p>
        Please double check to make sure it is up and running <span v-if="url">, and it is reachable at <code>{{ url }}</code></span>
      </p>
    </template>
  </KEmptyState>
</template>

<script>
import Kuma from '@/services/kuma'

export default {
  computed: {
    url() {
      return Kuma.url
    },
  },
}
</script>
