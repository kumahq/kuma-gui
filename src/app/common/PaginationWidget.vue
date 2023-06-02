<template>
  <div class="pagination">
    <KButton
      v-if="props.hasPrevious"
      appearance="primary"
      data-testid="pagination-previous-button"
      @click="onPreviousButtonClick"
    >
      <KIcon
        icon="chevronLeft"
        color="currentColor"
        size="16"
        hide-title
        aria-hidden="true"
      />

      Previous
    </KButton>

    <KButton
      v-if="props.hasNext"
      appearance="primary"
      data-testid="pagination-next-button"
      @click="onNextButtonClick"
    >
      Next

      <KIcon
        icon="chevronRight"
        color="currentColor"
        size="16"
        hide-title
        aria-hidden="true"
      />
    </KButton>
  </div>
</template>

<script lang="ts" setup>
import { KButton, KIcon } from '@kong/kongponents'

import { logEvents } from '@/services/logger/Logger'
import { useLogger } from '@/utilities'

const logger = useLogger()

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
  logger.info(logEvents.PAGINATION_NEXT_BUTTON_CLICKED)
}

function onPreviousButtonClick() {
  emit('previous')
  logger.info(logEvents.PAGINATION_PREVIOUS_BUTTON_CLICKED)
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
