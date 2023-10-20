<template>
  <KSlideout
    class="tray"
    close-button-alignment="end"
    :has-overlay="false"
    is-visible
    data-testid="tray"
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
.tray {
  // TODO: Remove or replace these once we switch to Kongponents v9 which will deprecate these variables.
  // Overrides KSlideout’s override.
  --KCardPaddingX: #{$kui-space-80} !important;
  --KCardPaddingY: #{$kui-space-80} !important;

  :deep(.panel),
  :deep(.panel-background),
  :deep(.panel-background-transparent) {
    // TODO: Remove this in favor of setting KSlideout’s `props.offsetTop` to `var(--AppHeaderHeight)` once Kongponents v9 is available (which has https://github.com/Kong/kongponents/pull/1769).
    // Overrides KSlideout’s top offset. `props.offsetTop` doesn’t accept plain CSS values.
    top: var(--AppHeaderHeight) !important;
  }
}

.tray :deep(.k-slideout-header-content) {
  padding-right: $kui-space-80;
  padding-left: $kui-space-80;
}

// Aligns the position of the close button with the tray card’s content box.
.tray :deep(.close-button-start),
.tray :deep(.close-button-end) {
  margin-top: $kui-space-80 !important;
}

.tray :deep(.close-button-start) {
  margin-left: $kui-space-80 !important;
}

.tray :deep(.close-button-end) {
  margin-right: $kui-space-80 !important;
}
</style>
