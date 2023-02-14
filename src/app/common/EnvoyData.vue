<template>
  <div class="envoy-data">
    <div class="envoy-data-actions">
      <KButton
        :disabled="isLoading"
        appearance="primary"
        icon="redo"
        data-testid="envoy-data-refresh-button"
        @click="fetchContent"
      >
        Refresh
      </KButton>
    </div>

    <StatusInfo
      :has-error="error !== null"
      :is-loading="isLoading"
      :error="error"
    >
      <CodeBlock
        :id="`code-block-${props.dataPath}`"
        language="json"
        :code="code"
        is-searchable
        :query-key="props.queryKey ?? `code-block-${props.dataPath}`"
      />
    </StatusInfo>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, PropType, ref, watch } from 'vue'
import { KButton } from '@kong/kongponents'

import CodeBlock from './CodeBlock.vue'
import StatusInfo from './StatusInfo.vue'
import { useKumaApi } from '@/utilities'

const kumaApi = useKumaApi()

const props = defineProps({
  dataPath: {
    type: String as PropType<'xds' | 'stats' | 'clusters'>,
    required: true,
  },

  queryKey: {
    type: String,
    required: false,
    default: null,
  },

  mesh: {
    type: String,
    required: false,
    default: '',
  },

  dppName: {
    type: String,
    required: false,
    default: '',
  },

  zoneIngressName: {
    type: String,
    required: false,
    default: '',
  },

  zoneEgressName: {
    type: String,
    required: false,
    default: '',
  },
})

const isLoading = ref(true)
const error = ref<Error | null>(null)
const code = ref('')

watch(() => props.dppName, function () {
  fetchContent()
})
watch(() => props.zoneIngressName, function () {
  fetchContent()
})
watch(() => props.zoneEgressName, function () {
  fetchContent()
})

onMounted(function () {
  fetchContent()
})

async function fetchContent() {
  error.value = null
  isLoading.value = true

  try {
    let content = ''

    if (props.mesh !== '' && props.dppName !== '') {
      content = await kumaApi.getDataplaneData({
        dataPath: props.dataPath,
        mesh: props.mesh,
        dppName: props.dppName,
      })
    } else if (props.zoneIngressName !== '') {
      content = await kumaApi.getZoneIngressData({
        dataPath: props.dataPath,
        zoneIngressName: props.zoneIngressName,
      })
    } else if (props.zoneEgressName !== '') {
      content = await kumaApi.getZoneEgressData({
        dataPath: props.dataPath,
        zoneEgressName: props.zoneEgressName,
      })
    }

    code.value = typeof content === 'string' ? content : JSON.stringify(content, null, 2)
  } catch (err) {
    if (err instanceof Error) {
      error.value = err
    } else {
      console.error(err)
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.envoy-data {
  padding: var(--spacing-md);
}

.envoy-data-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: var(--spacing-md);
}
</style>
