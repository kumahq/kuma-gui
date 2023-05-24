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
        size="18"
        :title="props.copyText"
      />

      <slot>
        <span class="visually-hidden">{{ props.copyText }}</span>
      </slot>
    </KButton>
  </KClipboardProvider>
</template>

<script lang="ts" setup>
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
    console.error(err)
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
  --tooltip-text-color: var(--white);
  --tooltip-background-color: var(--grey-600);
}

.copy-button[data-tooltip-copy-success="false"] {
  --tooltip-background-color: var(--red-700);
}

.copy-button[data-tooltip-text]::after {
  background-color: var(--tooltip-background-color);
  border-radius: 3px;
  color: var(--tooltip-text-color);
  content: attr(data-tooltip-text);
  font-weight: normal;
  padding: var(--spacing-xs);
  position: absolute;
  right: calc(100% + var(--spacing-xs));
  top: 50%;
  transform: translateY(-50%);
  white-space: nowrap;
}
</style>
