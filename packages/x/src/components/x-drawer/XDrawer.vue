<template>
  <XTeleportTemplate
    :to="{ name: 'drawer-layer'}"
  >
    <KSlideout
      :id="id"
      class="summary-slideout"
      :close-on-blur="false"
      :has-overlay="false"
      visible
      :max-width="props.width"
      data-testid="summary"
      @close="emit('close')"
    >
      <template #title>
        <XTeleportSlot :name="id" />
      </template>
      <slot />
    </KSlideout>
  </XTeleportTemplate>
</template>

<script lang="ts" setup>
import { KSlideout } from '@kong/kongponents'
import { onClickOutside } from '@vueuse/core'
import { provide, useId, onMounted, nextTick } from 'vue'

const id = useId()
provide('app-summary-view', id)

// recreates KSlideOuts close on blur, but ignores clicks on any anchors
const props = withDefaults(defineProps<{
  width?: string
  selector?: string
}>(), {
  width: '560px',
  selector: 'main',
})

const emit = defineEmits<{
  (event: 'close'): void
}>()

onMounted(async () => {
  await nextTick()
  const $el = document.getElementById(id)
  if($el) {
    onClickOutside(
      $el,
      (event: PointerEvent) => {
        const $el = event.target as HTMLElement
        if (
          (window.getSelection()?.isCollapsed ?? true)
            && !event.defaultPrevented
            && event.isTrusted
            && (!['button', 'a'].includes($el.nodeName.toLowerCase()) || $el.closest(props.selector))
        ) {
          emit('close')
        }
      },
    )
  }
})
</script>
<style lang="scss" scoped>
.summary-slideout {
  pointer-events: auto !important;
}
:deep(.slideout-backdrop) {
  pointer-events: none !important;
}
:deep(.slideout-header) {
  h1, h2, h4, h5, h6 {
    font-size: var(--x-font-size-70);
  }
  h1, h2 {
    --icon-name-start: var(--icon-wifi-tethering);
    --icon-color: var(--x-color-text-neutral);
    &::before {
      margin-right: var(--icon-space-after);
      content: '';
    }
  }
  button.slideout-close-icon {
    height: fit-content;
  }
}
:deep(.slideout-container) {
  z-index: auto !important;
  top: unset !important;
  height: calc(100vh - var(--x-drawer-offset-top)) !important;
}
</style>
