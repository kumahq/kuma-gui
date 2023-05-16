<template>
  <KButton
    appearance="outline"
    class="copy-button non-visual-button"
    data-testid="copy-button"
    :is-rounded="false"
    size="small"
    :title="props.copyText"
    type="button"
    @click="copyText"
  >
    <KIcon
      color="var(--black-45)"
      icon="copy"
      size="18"
      :title="props.copyText"
    />

    <span class="visually-hidden">{{ props.copyText }}</span>
  </KButton>
</template>

<script lang="ts" setup>
import { KButton, KIcon } from '@kong/kongponents'

import { copyTextToClipboard } from '@/utilities/copyTextToClipboard'

const props = defineProps({
  text: {
    type: String,
    required: true,
  },

  copyText: {
    type: String,
    required: false,
    default: 'Copy',
  },

  tooltipSuccessText: {
    type: String,
    required: false,
    default: 'Copied!',
  },
})

async function copyText(event: Event) {
  const button = event.currentTarget
  const hasCopiedCodeSuccessfully = await copyTextToClipboard(props.text)

  if (button instanceof HTMLButtonElement && hasCopiedCodeSuccessfully) {
    button.setAttribute('data-tooltip-text', props.tooltipSuccessText)

    window.setTimeout(function () {
      if (button instanceof HTMLButtonElement) {
        button.removeAttribute('data-tooltip-text')
      }
    }, 1500)
  }
}
</script>

<style lang="scss" scoped>
// Overrides KButton’s default padding.
.copy-button.copy-button {
  padding: 0;
}

.copy-button[data-tooltip-text]::after {
  background-color: var(--grey-600);
  border-radius: 3px;
  color: var(--white);
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
