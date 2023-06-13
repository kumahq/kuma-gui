<template>
  <div>
    <h3>1. {{ i18n.t('zones.form.universal.saveToken.title') }}</h3>

    <p>{{ i18n.t('zones.form.universal.saveToken.saveTokenDescription') }}</p>

    <CodeBlock
      id="zone-kubernetes-token"
      class="mt-4"
      :code="saveTokenCommand"
      language="bash"
    />

    <h3>2. {{ i18n.t('zones.form.universal.connectZone.title') }}</h3>

    <p>{{ i18n.t('zones.form.universal.connectZone.configDescription') }}</p>

    <span class="k-input-label mt-4">
      {{ i18n.t('zones.form.universal.connectZone.configFileName') }}
    </span>

    <CodeBlock
      id="zone-universal-config-code-block"
      class="mt-4"
      :code="universalConfig"
      language="yaml"
    />

    <p class="mt-4">
      {{ i18n.t('zones.form.universal.connectZone.connectDescription') }}
    </p>

    <CodeBlock
      id="zone-universal-connect-command-code-block"
      class="mt-4"
      :code="i18n.t('zones.form.universal.connectZone.connectCommand').trim()"
      language="bash"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import CodeBlock from '@/app/common/CodeBlock.vue'
import { useStore } from '@/store/store'
import { useI18n } from '@/utilities'

const i18n = useI18n()
const route = useRoute()
const store = useStore()

const props = defineProps({
  zoneName: {
    type: String,
    required: true,
  },

  token: {
    type: String,
    required: true,
  },
})

const saveTokenCommand = computed(() => i18n.t('zones.form.universal.saveToken.saveTokenCommand', { token: props.token }).trim())
const universalConfig = computed(() => {
  const placeholders: Record<string, string> = {
    zoneName: props.zoneName,
    globalKdsAddress: store.state.globalKdsAddress,
  }

  if (typeof route.params.virtualControlPlaneId === 'string') {
    placeholders.controlPlaneId = route.params.virtualControlPlaneId
  }

  return i18n.t('zones.form.universal.connectZone.config', placeholders).trim()
})
</script>

<style lang="scss" scoped>
// TODO: Remove these once we have this sort of style covered by our base styles.
h3:not(:first-child),
p:not(:first-child) {
  margin-top: var(--spacing-md);
}
</style>
