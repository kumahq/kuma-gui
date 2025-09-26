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
    <template #title>
      <XTeleportSlot :name="id" />
    </template>
    <slot />
  </KSlideout>
</template>

<script lang="ts" setup>
import { onClickOutside, useThrottleFn } from '@vueuse/core'
import { ref, provide, useId } from 'vue'

const id = useId()
provide('app-summary-view', id)

// recreates KSlideOuts close on blur, but ignores clicks on any anchors
const slideOutRef = ref(null)
onClickOutside(
  // @ts-ignore CI only ts error
  slideOutRef,
  useThrottleFn((event: PointerEvent) => {
    const $el = event.target as HTMLElement
    if ((window.getSelection()?.isCollapsed ?? true) && !event.defaultPrevented && event.isTrusted && $el.nodeName.toLowerCase() !== 'a') {
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
.summary-slideout {
  --app-view-content-top: 0;
}
:deep(.slideout-header) {
  h1, h2, h4, h5, h6 {
    font-size: $kui-font-size-70;
  }
  h1, h2 {
    --icon-name-start: var(--icon-wifi-tethering);
    --icon-color: #{$kui-color-text-neutral};
    &::before {
      margin-right: var(--icon-space-after);
      content: '';
    }
  }
  button.slideout-close-icon {
    height: fit-content;
  }
}
</style>
