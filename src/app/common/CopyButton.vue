<template>
  <KClipboardProvider v-slot="{ copyToClipboard }">
    <KButton
      appearance="outline"
      class="copy-button non-visual-button"
      data-testid="copy-button"
      :is-rounded="false"
      size="small"
      :title="props.copyText"
      type="button"
      @click="copy($event, copyToClipboard)"
    >
      <KIcon
        color="currentColor"
        icon="copy"
        :size="KUI_ICON_SIZE_30"
        :title="props.copyText"
      />

      <slot>
        <span class="visually-hidden">{{ props.copyText }}</span>
      </slot>
    </KButton>
  </KClipboardProvider>
</template>

<script lang="ts" setup>
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { KButton, KClipboardProvider, KIcon } from '@kong/kongponents'

import type { PropType } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: false,
    default: '',
  },

  getText: {
    type: Function as PropType<() => string | Promise<string>>,
    required: false,
    default: null,
  },

  copyText: {
    type: String,
    required: false,
    default: 'Copy',
  },

  tooltipSuccessText: {
    type: String,
    required: false,
    default: 'Copied code!',
  },

  tooltipFailText: {
    type: String,
    required: false,
    default: 'Failed to copy!',
  },
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

<style lang="scss" scoped>
// Overrides KButton’s default padding.
.copy-button.copy-button {
  padding: 0;
}

.copy-button {
  --tooltip-background-color: #{$kui-color-background-neutral-stronger};
}

.copy-button[data-tooltip-copy-success="false"] {
  --tooltip-background-color: #{$kui-color-background-danger-stronger};
}

.copy-button[data-tooltip-text]::after {
  background-color: var(--tooltip-background-color);
  border-radius: 3px;
  color: $kui-color-text-inverse;
  content: attr(data-tooltip-text);
  font-weight: $kui-font-weight-regular;
  padding: $kui-space-40;
  position: absolute;
  right: calc(100% + $kui-space-40);
  top: 50%;
  transform: translateY(-50%);
  white-space: nowrap;
}
</style>
