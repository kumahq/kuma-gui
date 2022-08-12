<template>
  <KEmptyState
    class="global-api-status empty-state--wide-content empty-state--compact"
    cta-is-hidden
  >
    <template #title>
      <KIcon
        class="kong-icon--centered"
        color="var(--yellow-300)"
        secondary-color="var(--black-75)"
        icon="warning"
        size="64"
      />
      Unable to reach the API
    </template>
    <template #message>
      <p>
        Please double check to make sure it is up and running
        <span v-if="url">, and it is reachable at <code>{{ url }}</code></span>
      </p>
    </template>
  </KEmptyState>
</template>

<script>
import { getKumaCpServerUrl } from '@/configUrl'

export default {
  computed: {
    url() {
      return getKumaCpServerUrl()
    },
  },
}
</script>
