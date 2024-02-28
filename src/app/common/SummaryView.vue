<template>
  <KSlideout
    ref="slideOutRef"
    class="summary-slideout"
    :close-on-blur="false"
    :has-overlay="false"
    visible
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
.summary-slideout :deep(.slideout-header) {
  position: absolute;
  z-index: 200;
  right: 0;
  top: 20px;
}

.summary-slideout :deep(.app-view-title-bar) {
  position: absolute;
  z-index: 199;
  top: 20px;
  right: 20px;
  left: 20px;
  background-color: $kui-color-background;
  margin-bottom: 0;
  padding-bottom: $kui-space-50;
  padding-right: $kui-space-90;
  display: flex;
  align-items: baseline;

  + * {
    margin-top: $kui-space-130;
  }

  h1, h2 {
    --icon-before: url('@/assets/images/icon-wifi-tethering.svg');
    margin-top: 0;

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
</style>
