<template>
  <div class="pagination">
    <KButton
      v-if="hasPrevious"
      ref="paginatePrev"
      appearance="primary"
      @click="onPreviousButtonClick"
    >
      &lsaquo; Previous
    </KButton>

    <KButton
      v-if="hasNext"
      ref="paginateNext"
      appearance="primary"
      @click="onNextButtonClick"
    >
      Next &rsaquo;
    </KButton>
  </div>
</template>

<script>
import { datadogLogs } from '@datadog/browser-logs'
import { datadogLogEvents } from '@/datadogEvents'

export default {
  name: 'Pagination',
  props: {
    hasPrevious: {
      type: Boolean,
      default: false,
    },
    hasNext: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onNextButtonClick() {
      this.$emit('next')
      datadogLogs.logger.info(datadogLogEvents.PAGINATION_NEXT_BUTTON_CLICKED)
    },
    onPreviousButtonClick() {
      this.$emit('previous')
      datadogLogs.logger.info(datadogLogEvents.PAGINATION_PREVIOUS_BUTTON_CLICKED)
    },
  },
}
</script>

<style lang="scss" scoped>
.pagination {
  // display: flex;
  // justify-content: space-between;
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
