<template>
  <div>
    <h3>1. {{ i18n.t('zones.form.universal.copySaveToken.title') }}</h3>

    <KAlert
      class="mt-4"
      appearance="info"
    >
      <template #alertMessage>
        {{ i18n.t('zones.form.universal.copySaveToken.alertMessage') }}
      </template>
    </KAlert>

    <CodeBlock
      id="zone-kubernetes-token"
      class="mt-4"
      :code="props.token"
      language="bash"
    />

    <h3>2. {{ i18n.t('zones.form.universal.connectZone.title') }}</h3>

    <p>{{ i18n.t('zones.form.universal.connectZone.description1') }}</p>

    <span class="k-input-label mt-4">
      {{ i18n.t('zones.form.universal.connectZone.fileName') }}
    </span>

    <CodeBlock
      id="zone-universal-config-code-block"
      class="mt-4"
      :code="universalConfig"
      language="yaml"
    />

    <p class="mt-4">
      {{ i18n.t('zones.form.universal.connectZone.description2') }}
    </p>

    <CodeBlock
      id="zone-universal-connect-command-code-block"
      class="mt-4"
      :code="i18n.t('zones.form.universal.connectZone.command')"
      language="bash"
    />
  </div>
</template>

<script lang="ts" setup>
import { KAlert } from '@kong/kongponents'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import CodeBlock from '@/app/common/CodeBlock.vue'
import {
  useI18n,
  useGetGlobalKdsAddress,
} from '@/utilities'

const getGlobalKdsAddress = useGetGlobalKdsAddress()
const i18n = useI18n()
const route = useRoute()

const props = defineProps({
  zoneName: {
    type: String,
    required: true,
  },

  token: {
    type: String,
    required: true,
  },

  base64EncodedToken: {
    type: String,
    required: true,
  },
})

const universalConfig = computed(() => {
  const placeholders: Record<string, string> = {
    zoneName: props.zoneName,
    globalKdsAddress: getGlobalKdsAddress(),
    token: props.base64EncodedToken,
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
