<template>
  <div class="code-block">
    <!-- eslint-disable vue/no-v-html -->
    <pre
      class="code-block__code"
      :class="`language-${language}`"
      data-testid="code-block"
    ><code v-html="highlightedCode" /></pre>
    <!-- eslint-enable vue/no-v-html -->

    <KClipboardProvider v-slot="{ copyToClipboard }">
      <KPop placement="bottom">
        <button
          class="code-block__copy-button"
          type="button"
          @click="copyToClipboard(reformattedCode)"
        >
          <KIcon
            icon="copy"
            size="24"
            color="var(--blue-500)"
          />

          <span class="kutil-sr-only">Copy</span>
        </button>

        <template #content>
          <p>Code copied to clipboard</p>
        </template>
      </KPop>
    </KClipboardProvider>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { KClipboardProvider, KIcon, KPop } from '@kong/kongponents'

import { highlightCode } from '@/utils/highlightCode'
import { reformatYaml } from '@/utils/reformatYaml'

const props = defineProps<{
  language: string
  code: string
}>()

const reformattedCode = computed(() => props.language === 'yaml' ? reformatYaml(props.code) : props.code)
const highlightedCode = computed(() => highlightCode(reformattedCode.value, props.language))
</script>

<style lang="scss" scoped>
.code-block {
  position: relative;
}

.code-block__code {
  margin-top: 0;
  margin-bottom: 0;
  border-radius: 3px;
  background-color: var(--grey-100);
  font-size: var(--type-sm);
}

.code-block__copy-button {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  display: block;
}
</style>
