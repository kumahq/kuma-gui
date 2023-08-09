<template>
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
</template>

<script lang="ts" setup>
import { PropType, computed } from 'vue'

import CodeBlock from './CodeBlock.vue'
import CopyButton from './CopyButton.vue'
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

  resource: {
    type: Object as PropType<Entity>,
    required: true,
  },

  /**
   * Function returning the resource.
   */
  resourceFetcher: {
    type: Function as PropType<(params?: SingleResourceParameters) => Promise<Entity>>,
    required: true,
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

const yamlUniversal = computed(() => toYamlRepresentation(props.resource))

async function getYamlAsKubernetes() {
  const resourceKubernetes = await props.resourceFetcher({ format: 'kubernetes' })

  return toYamlRepresentation(resourceKubernetes)
}

function toYamlRepresentation(resource: Entity): string {
  const { creationTime, modificationTime, ...resourceWithoutTimes } = resource

  return toYaml(resourceWithoutTimes)
}
</script>
