<template>
  <div class="local-cps">
    <FrameSkeleton class="py-2 px-4">
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

        <template #actions>
          <KClipboardProvider v-slot="{ copyToClipboard }">
            <KPop placement="bottom">
              <KButton
                appearance="primary"
                @click="copyToClipboard(code)"
              >
                Copy config to clipboard
              </KButton>

              <template #content>
                <div>
                  <p>Config copied to clipboard!</p>
                </div>
              </template>
            </KPop>
          </KClipboardProvider>
        </template>
      </KCard>
    </FrameSkeleton>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { KButton, KCard, KClipboardProvider, KPop } from '@kong/kongponents'

import { storeKey } from '@/store/store'
import CodeBlock from '@/components/CodeBlock.vue'
import FrameSkeleton from '@/components/Skeletons/FrameSkeleton.vue'
import LoadingBlock from '@/components/LoadingBlock.vue'

const store = useStore(storeKey)

const code = computed(() => {
  const config = store.getters['config/getConfig']

  if (config) {
    return JSON.stringify(config, null, 2)
  } else {
    return null
  }
})
</script>
