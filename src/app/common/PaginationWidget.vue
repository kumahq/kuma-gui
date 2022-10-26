<template>
  <div class="pagination">
    <KButton
      v-if="props.hasPrevious"
      appearance="primary"
      @click="onPreviousButtonClick"
    >
      &lsaquo; Previous
    </KButton>

    <KButton
      v-if="props.hasNext"
      appearance="primary"
      @click="onNextButtonClick"
    >
      Next &rsaquo;
    </KButton>
  </div>
</template>

<script lang="ts" setup>
import { datadogLogs } from '@datadog/browser-logs'
import { KButton } from '@kong/kongponents'

import { datadogLogEvents } from '@/utilities/datadogLogEvents'

const props = defineProps({
  hasPrevious: {
    type: Boolean,
    default: false,
  },

  hasNext: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['next', 'previous'])

function onNextButtonClick() {
  emit('next')
  datadogLogs.logger.info(datadogLogEvents.PAGINATION_NEXT_BUTTON_CLICKED)
}

function onPreviousButtonClick() {
  emit('previous')
  datadogLogs.logger.info(datadogLogEvents.PAGINATION_PREVIOUS_BUTTON_CLICKED)
}
</script>

<style lang="scss" scoped>
.pagination {
  padding: var(--spacing-sm);
  text-align: right;

  button {
    font-size: 14px;
    padding: 4px 8px;

    &:not(:first-of-type) {
      margin-left: var(--spacing-sm);
    }

    &:after {
      display: none;
    }
  }
}
</style>
