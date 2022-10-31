<template>
  <KEmptyState>
    <template #title>
      <KIcon
        class="kong-icon--centered"
        icon="dangerCircleOutline"
        size="42"
      />

      <p>{{ productName }} is running in Standalone mode.</p>
    </template>
    <template #message>
      <p>
        To access this page, you must be running in <strong>Multi-Zone</strong> mode.
      </p>
    </template>
    <template #cta>
      <KButton
        :to="`https://kuma.io/docs/${kumaDocsVersion}/documentation/deployments/`"
        target="_blank"
        appearance="primary"
      >
        Learn More
      </KButton>
    </template>
  </KEmptyState>
</template>

<script>
import { mapGetters } from 'vuex'
import { PRODUCT_NAME } from '@/constants'
export default {
  name: 'MultizoneInfo',
  data() {
    return {
      productName: PRODUCT_NAME,
    }
  },
  computed: {
    ...mapGetters({
      kumaDocsVersion: 'config/getKumaDocsVersion',
    }),
  },
}
</script>
