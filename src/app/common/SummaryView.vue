<template>
  <KSlideout
    ref="slideOutRef"
    class="summary-slideout"
    prevent-close-on-blur
    close-button-alignment="end"
    :has-overlay="false"
    is-visible
    :max-width="props.width"
    offset-top="var(--app-slideout-offset-top, 0)"
    data-testid="summary"
    @close="emit('close')"
  >
    <slot />
  </KSlideout>
</template>

<script lang="ts" setup>
import { onClickOutside, useThrottleFn } from '@vueuse/core'
import { ref } from 'vue'
// recreates KSlideOuts close on blur, but ignores clicks on any anchors
const slideOutRef = ref(null)
onClickOutside(
  // @ts-ignore CI only ts error
  slideOutRef,
  useThrottleFn((event: PointerEvent) => {
    const $el = event.target as HTMLElement
    if (event.isTrusted && $el.nodeName.toLowerCase() !== 'a') {
      emit('close')
    }
  }, 1, true, false),
)
const props = withDefaults(defineProps<{
  width?: string
}>(), {
  width: '560px',
})
const emit = defineEmits<{
  (event: 'close'): void
}>()
</script>

<style lang="scss" scoped>
.summary-slideout :deep(.app-view-title-bar) {
  display: flex;
  // Accounts for the absolutely-positioned close button
  margin-right: calc($kui-space-30 + 24px);
  h1, h2, h3, h4, h5, h6 {
    --icon-before: url('@/assets/images/icon-wifi-tethering.svg');
    &::before {
      color: $kui-color-text-neutral;
      mask-repeat: no-repeat;
      -webkit-mask-repeat: no-repeat;
      mask-position: center;
      -webkit-mask-position: center;
      content: '';
      display: inline-flex;
      background-color: currentColor;

      mask-image: var(--icon-before);
      -webkit-mask-image: var(--icon-before);
      width: 16px;
      height: 16px;
      margin-right: $kui-space-30;
    }

  }
}
.summary-slideout :deep(.k-slideout-header-content) {
  padding-right: $kui-space-80;
  padding-left: $kui-space-80;
}

.summary-slideout :deep(.border-styles) {
  // TODO: Remove this override once KSlideout was updated in Kongponents v9’s alpha version.
  // Overrides the left border color to the same value KCard uses for its borders.
  border-left-color: rgba(0, 0, 0, 0.1);
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
