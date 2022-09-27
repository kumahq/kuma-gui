<template>
  <div class="component-frame">
    <LoadingBlock v-if="code === null" />

    <KCard
      v-else
      border-variant="noBorder"
    >
      <template #body>
        <CodeBlock
          language="json"
          :code="code"
        />
      </template>
    </KCard>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { KCard } from '@kong/kongponents'

import { useStore } from '@/store/store'
import CodeBlock from '@/components/CodeBlock.vue'
import LoadingBlock from '@/components/LoadingBlock.vue'

const store = useStore()

const code = computed(() => {
  const config = store.getters['config/getConfig']

  if (config) {
    return JSON.stringify(config, null, 2)
  } else {
    return null
  }
})
</script>
