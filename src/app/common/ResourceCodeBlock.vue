<template>
  <StatusInfo
    :is-loading="isLoading"
    :error="error"
  >
    <CodeBlock
      :id="id"
      language="yaml"
      :code="yamlUniversal"
      :is-searchable="props.isSearchable"
      :query-key="props.id"
      :code-max-height="props.codeMaxHeight"
    >
      <template
        v-if="showCopyAsKubernetesButton"
        #secondary-actions
      >
        <CopyButton
          :get-text="getYamlAsKubernetes"
          :copy-text="i18n.t('common.copyKubernetesText')"
        >
          {{ i18n.t('common.copyKubernetesShortText') }}
        </CopyButton>
      </template>
    </CodeBlock>
  </StatusInfo>
</template>

<script lang="ts" setup>
import { PropType, ref, watch } from 'vue'

import CodeBlock from './CodeBlock.vue'
import CopyButton from './CopyButton.vue'
import StatusInfo from './StatusInfo.vue'
import type { SingleResourceParameters } from '@/types/api.d'
import type { Entity } from '@/types/index.d'
import { useI18n } from '@/utilities'
import { toYaml } from '@/utilities/toYaml'

const i18n = useI18n()

const props = defineProps({
  id: {
    type: String,
    required: true,
  },

  /**
   * Function returning the resource.
   */
  resourceFetcher: {
    type: Function as PropType<(params?: SingleResourceParameters) => Promise<Entity>>,
    required: true,
  },

  /**
   * Triggers re-fetching the resource when set to a new value. Provide it with an updating resource name, for example, to update rendered content.
   */
  resourceFetcherWatchKey: {
    type: [String, Number] as PropType<string | number | null>,
    required: false,
    default: null,
  },

  codeMaxHeight: {
    type: String,
    required: false,
    default: null,
  },

  isSearchable: {
    type: Boolean,
    required: false,
    default: false,
  },

  showCopyAsKubernetesButton: {
    type: Boolean,
    required: false,
    default: true,
  },
})

const yamlUniversal = ref('')
const isLoading = ref(false)
const error = ref<Error | null>(null)

watch(() => props.resourceFetcherWatchKey, function (newKey, oldKey) {
  if (newKey !== oldKey && newKey !== null) {
    fetchResource()
  }
})

watch(() => props.resourceFetcher, function () {
  fetchResource()
}, { immediate: true })

async function fetchResource() {
  isLoading.value = true
  error.value = null

  try {
    const resourceUniversal = await props.resourceFetcher()

    yamlUniversal.value = toYamlRepresentation(resourceUniversal)
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

async function getYamlAsKubernetes() {
  const resourceKubernetes = await props.resourceFetcher({ format: 'kubernetes' })

  return toYamlRepresentation(resourceKubernetes)
}

function toYamlRepresentation(resource: Entity): string {
  const { creationTime, modificationTime, ...resourceWithoutTimes } = resource

  return toYaml(resourceWithoutTimes)
}
</script>
