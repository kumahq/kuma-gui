<template>
  <div class="stack">
    <XAlert
      v-if="Object.keys(props.subscription.status.acknowledgements).length === 0"
      appearance="info"
    >
      <template #icon>
        <PortalIcon />
      </template>

      {{ t('common.detail.subscriptions.no_stats', { id: props.subscription.id }) }}
    </XAlert>

    <template v-else>
      <div>
        <div
          v-if="$slots.default"
          class="intro"
        >
          <slot name="default" />
        </div>
        <div class="row">
          <div class="header">
            {{ t('common.detail.subscriptions.type') }}
          </div>

          <div class="header">
            {{ t('common.detail.subscriptions.responses_sent_acknowledged') }}
          </div>
        </div>

        <div
          v-for="(row, prop) in props.subscription.status.acknowledgements"
          :key="prop"
          class="row"
          :data-testid="`subscription-status-${prop}`"
        >
          <div class="type">
            {{ t(`http.api.property.${prop}`) }}
          </div>

          <div>
            {{ row.responsesSent }}/{{ row.responsesAcknowledged }}
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { PortalIcon } from '@kong/icons'
import { PropType } from 'vue'

import type { Subscription } from '../data'
import { useI18n } from '@/app/application'

const { t } = useI18n()

const props = defineProps({
  subscription: {
    type: Object as PropType<Subscription>,
    required: true,
  },

  isDiscoverySubscription: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss" scoped>
.intro,
.row {
  padding: $kui-space-40;
}
.row {
  display: grid;
  grid-template-columns: 30ch 1fr;
}

.header,
.type {
  font-weight: $kui-font-weight-semibold;
}

.type {
  color: $kui-color-text-neutral-stronger;
}
</style>
