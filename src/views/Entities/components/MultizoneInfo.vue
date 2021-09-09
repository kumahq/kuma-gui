<template>
  <KEmptyState>
    <template v-slot:title>
      <KIcon
        class="kong-icon--centered"
        icon="dangerCircle"
        size="64"
      />
      {{ productName }} is running in Standalone mode.
    </template>
    <template v-slot:message>
      <p>
        To access this page, you must be running in <strong>Multi-Zone</strong> mode.
      </p>
    </template>
    <template v-slot:cta>
      <KButton
        to="https://kuma.io/docs/0.6.0/documentation/deployments/"
        target="_blank"
        appearance="primary"
      >
        Learn More
      </KButton>
    </template>
  </KEmptyState>
</template>

<script>
import { PRODUCT_NAME } from '@/consts'
export default {
  name: 'MultizoneInfo',
  data() {
    return {
      productName: PRODUCT_NAME,
    }
  },
}
</script>
