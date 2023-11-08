<template>
  <KSlideout
    class="summary-slideout"
    close-button-alignment="end"
    :has-overlay="false"
    is-visible
    data-testid="summary"
    @close="emit('close')"
  >
    <slot />
  </KSlideout>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
  (event: 'close'): void
}>()
</script>

<style lang="scss" scoped>
.summary-slideout {
  // TODO: Remove or replace these once we switch to Kongponents v9 which will deprecate these variables.
  // Overrides KSlideout’s override.
  --KCardPaddingX: #{$kui-space-80} !important;
  --KCardPaddingY: #{$kui-space-80} !important;

  :deep(.panel),
  :deep(.panel-background),
  :deep(.panel-background-transparent) {
    // TODO: Remove this in favor of setting KSlideout’s `props.offsetTop` to `var(--AppHeaderHeight)` once Kongponents v9 is available (which has https://github.com/Kong/kongponents/pull/1769).
    // Overrides KSlideout’s top offset. `props.offsetTop` doesn’t accept plain CSS values.
    top: var(--app-slideout-offset-top) !important;
  }
}

.summary-slideout :deep(.k-slideout-header-content) {
  padding-right: $kui-space-80;
  padding-left: $kui-space-80;
}

.summary-slideout :deep(.panel) {
  // Increases width of the content area a little.
  max-width: 560px;
  // TODO: Remove this once we switch to Kongponents v9 which will fix this issue (https://github.com/Kong/kongponents/pull/1822).
  // Fixes the content being taller than the viewport when using `props.offsetHeight`.
  height: calc(100vh - var(--app-slideout-offset-top)) !important;
}

// Aligns the position of the close button with the summary slideout card’s content box.
.summary-slideout :deep(.close-button-start),
.summary-slideout :deep(.close-button-end) {
  margin-top: $kui-space-80 !important;
}

.summary-slideout :deep(.close-button-start) {
  margin-left: $kui-space-80 !important;
}

.summary-slideout :deep(.close-button-end) {
  margin-right: $kui-space-80 !important;
}
</style>
