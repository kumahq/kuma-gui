<template>
  <KClipboardProvider v-slot="{ copyToClipboard }">
    <KButton
      v-bind="$attrs"
      appearance="tertiary"
      class="copy-button non-visual-button"
      data-testid="copy-button"
      type="button"
      @click="copy($event, copyToClipboard)"
    >
      <CopyIcon />

      <slot>
        <span class="visually-hidden">{{ props.copyText }}</span>
      </slot>
    </KButton>
  </KClipboardProvider>
</template>

<script lang="ts" setup>
import { CopyIcon } from '@kong/icons'

const props = withDefaults(defineProps<{
  text?: string
  copyText?: string
  tooltipSuccessText?: string
}>(), {
  text: '',
  copyText: 'Copy',
  tooltipSuccessText: 'Copied code!',
})

async function copy(event: Event, copyToClipboard: (text: string) => Promise<boolean>) {
  const button = event.currentTarget
  let hasCopiedCodeSuccessfully = false

  try {
    hasCopiedCodeSuccessfully = await copyToClipboard(props.text)
  } catch (err) {
    hasCopiedCodeSuccessfully = false
  } finally {
    const text = hasCopiedCodeSuccessfully ? props.tooltipSuccessText : 'Failed to copy!'

    if (button instanceof HTMLButtonElement) {
      button.setAttribute('data-tooltip-copy-success', String(hasCopiedCodeSuccessfully))
      button.setAttribute('data-tooltip-text', text)

      window.setTimeout(function () {
        if (button instanceof HTMLButtonElement) {
          button.removeAttribute('data-tooltip-text')
        }
      }, 1500)
    }
  }
}
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<style lang="scss" scoped>
// Overrides KButton’s default padding.
.copy-button.copy-button {
  padding: 0;
}

.copy-button {
  position: relative;
  --tooltip-background-color: #{$kui-color-background-neutral-stronger};
}

.copy-button[data-tooltip-copy-success="false"] {
  --tooltip-background-color: #{$kui-color-background-danger-stronger};
}

.copy-button[data-tooltip-text]::after {
  background-color: var(--tooltip-background-color);
  border-radius: $kui-border-radius-10;
  color: $kui-color-text-inverse;
  content: attr(data-tooltip-text);
  font-weight: $kui-font-weight-regular;
  padding: $kui-space-40;
  position: absolute;
  right: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
  white-space: nowrap;
}
</style>
