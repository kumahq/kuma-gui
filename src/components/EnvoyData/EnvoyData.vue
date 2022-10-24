<template>
  <StatusInfo
    class="envoy-data"
    :has-error="error !== undefined"
    :is-loading="isLoading"
    :error="error"
  >
    <CodeBlock
      :id="`code-block-${dataPath}`"
      language="json"
      :code="code"
      is-searchable
      :query-key="queryKey ?? `code-block-${dataPath}`"
    />
  </StatusInfo>
</template>

<script lang="ts" setup>
import { onMounted, PropType, ref, watch } from 'vue'

import Kuma from '@/services/kuma'
import CodeBlock from '@/app/common/CodeBlock.vue'
import StatusInfo from '@/components/Utils/StatusInfo.vue'

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
const error = ref<Error | undefined>(undefined)
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
  error.value = undefined
  isLoading.value = true

  try {
    let content = ''

    if (props.mesh !== '' && props.dppName !== '') {
      content = await Kuma.getDataplaneData({
        dataPath: props.dataPath,
        mesh: props.mesh,
        dppName: props.dppName,
      })
    } else if (props.zoneIngressName !== '') {
      content = await Kuma.getZoneIngressData({
        dataPath: props.dataPath,
        zoneIngressName: props.zoneIngressName,
      })
    } else if (props.zoneEgressName !== '') {
      content = await Kuma.getZoneEgressData({
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

<style lang="scss">
.code-container .k-card-body {
  position: relative;
}
</style>

<style lang="scss" scoped>
.envoy-data {
  padding: var(--spacing-md);
}

.copy-button {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  display: block;
}
</style>
