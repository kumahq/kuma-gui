<template>
  <KClipboardProvider v-slot="{ copyToClipboard }">
    <KButton
      v-bind="$attrs"
      appearance="tertiary"
      class="copy-button"
      :class="{
        'non-visual-button': !props.hasBorder,
      }"
      data-testid="copy-button"
      :title="!props.hideTitle ? props.copyText : undefined"
      type="button"
      @click="copy($event, copyToClipboard)"
    >
      <CopyIcon
        :color="KUI_COLOR_TEXT_NEUTRAL"
        :title="!props.hideTitle ? props.copyText : undefined"
        :hide-title="props.hideTitle"
      />

      <slot>
        <span class="visually-hidden">{{ props.copyText }}</span>
      </slot>
    </KButton>
  </KClipboardProvider>
</template>

<script lang="ts" setup>
import { KUI_COLOR_TEXT_NEUTRAL } from '@kong/design-tokens'
import { CopyIcon } from '@kong/icons'

const props = withDefaults(defineProps<{
  text?: string
  getText?: (() => string | Promise<string>) | null
  copyText?: string
  tooltipSuccessText?: string
  tooltipFailText?: string
  hasBorder?: boolean
  hideTitle?: boolean
}>(), {
  text: '',
  getText: null,
  copyText: 'Copy',
  tooltipSuccessText: 'Copied code!',
  tooltipFailText: 'Failed to copy!',
  hasBorder: false,
  hideTitle: false,
})

async function copy(event: Event, copyToClipboard: (text: string) => Promise<boolean>) {
  const button = event.currentTarget
  let hasCopiedCodeSuccessfully = false

  try {
    const text = props.getText ? await props.getText() : props.text
    hasCopiedCodeSuccessfully = await copyToClipboard(text)
  } catch (err) {
    hasCopiedCodeSuccessfully = false
  } finally {
    const text = hasCopiedCodeSuccessfully ? props.tooltipSuccessText : props.tooltipFailText

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
