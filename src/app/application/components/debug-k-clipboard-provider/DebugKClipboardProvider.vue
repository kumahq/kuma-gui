<template>
  <ClipboardProvider v-slot="{ copyToClipboard }">
    <slot
      name="default"
      :copy-to-clipboard="async (text: string) => {
        const res = await copyToClipboard(text)
        if(res) {
          console.info(
            `%cdebug-k-clipboard-provider: The following was copied to the clipboard:`, 'color: blue',
            `
${text}`,
          )
        } else {
          console.error(
            `debug-k-clipboard-provider: The following wasn't copied to the clipboard:`,
            `
${text}`,
          )

        }
        return res;
      }"
    />
  </ClipboardProvider>
</template>
<script lang="ts" setup>
import { KClipboardProvider as ClipboardProvider } from '@kong/kongponents'
</script>
