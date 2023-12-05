<template>
  <div>
    <h3 class="form-step-title">
      <span class="form-step-number">1</span>
      {{ t('zones.form.universal.saveToken.title') }}
    </h3>

    <p>{{ t('zones.form.universal.saveToken.saveTokenDescription') }}</p>

    <CodeBlock
      id="zone-kubernetes-token"
      class="mt-4"
      :code="saveTokenCommand"
      language="bash"
    />

    <h3 class="form-step-title">
      <span class="form-step-number">2</span>
      {{ t('zones.form.universal.connectZone.title') }}
    </h3>

    <p>{{ t('zones.form.universal.connectZone.configDescription') }}</p>

    <span class="field-group-label mt-4">
      {{ t('zones.form.universal.connectZone.configFileName') }}
    </span>

    <CodeBlock
      id="zone-universal-config-code-block"
      data-testid="zone-universal-config"
      class="mt-4"
      :code="universalConfig"
      language="yaml"
    />

    <p class="mt-4">
      {{ t('zones.form.universal.connectZone.connectDescription') }}
    </p>

    <CodeBlock
      id="zone-universal-connect-command-code-block"
      class="mt-4"
      :code="t('zones.form.universal.connectZone.connectCommand').trim()"
      language="bash"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useI18n } from '@/app/application'
import CodeBlock from '@/app/common/CodeBlock.vue'

const { t } = useI18n()
const route = useRoute()

const props = defineProps({
  zoneName: {
    type: String,
    required: true,
  },

  globalKdsAddress: {
    type: String,
    required: true,
  },

  token: {
    type: String,
    required: true,
  },
})

const saveTokenCommand = computed(() => t('zones.form.universal.saveToken.saveTokenCommand', { token: props.token }).trim())
const universalConfig = computed(() => {
  const placeholders: Record<string, string> = {
    zoneName: props.zoneName,
    globalKdsAddress: props.globalKdsAddress,
  }

  if (typeof route.params.virtualControlPlaneId === 'string') {
    placeholders.controlPlaneId = route.params.virtualControlPlaneId
  }

  return t('zones.form.universal.connectZone.config', placeholders).trim()
})
</script>
