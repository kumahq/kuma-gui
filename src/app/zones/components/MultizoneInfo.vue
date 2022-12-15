<template>
  <KEmptyState>
    <template #title>
      <KIcon
        class="mb-3"
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
        :to="`${env('KUMA_DOCS_URL')}/documentation/deployments/?${env('KUMA_UTM_QUERY_PARAMS')}`"
        target="_blank"
        appearance="primary"
      >
        Learn More
      </KButton>
    </template>
  </KEmptyState>
</template>

<script>
import { KButton, KEmptyState, KIcon } from '@kong/kongponents'

import { PRODUCT_NAME } from '@/constants'
import { useEnv } from '@/utilities/useEnv'
const env = useEnv()

export default {
  name: 'MultizoneInfo',

  components: {
    KButton,
    KEmptyState,
    KIcon,
  },

  data() {
    return {
      env,
      productName: PRODUCT_NAME,
    }
  },
}
</script>
