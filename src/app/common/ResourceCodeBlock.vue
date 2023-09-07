<template>
  <CodeBlock
    :id="id"
    language="yaml"
    :code="yamlUniversal"
    :is-searchable="props.isSearchable"
    :query-key="props.id"
    :code-max-height="props.codeMaxHeight"
  >
    <template #secondary-actions>
      <KTooltip
        class="kubernetes-copy-button-tooltip"
        :label="t('common.copyKubernetesText')"
        placement="bottomEnd"
        max-width="200"
      >
        <CopyButton
          class="kubernetes-copy-button"
          :get-text="getYamlAsKubernetes"
          :copy-text="t('common.copyKubernetesText')"
          has-border
          hide-title
        >
          {{ t('common.copyKubernetesShortText') }}
        </CopyButton>
      </KTooltip>
    </template>
  </CodeBlock>
</template>

<script lang="ts" setup>
import { KTooltip } from '@kong/kongponents'
import { PropType, computed } from 'vue'

import CodeBlock from './CodeBlock.vue'
import CopyButton from './CopyButton.vue'
import type { SingleResourceParameters } from '@/types/api.d'
import type { Entity } from '@/types/index.d'
import { useI18n } from '@/utilities'
import { toYaml } from '@/utilities/toYaml'

const { t } = useI18n()

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

<style lang="scss">
.kubernetes-copy-button-tooltip {
  display: flex;
}

.kubernetes-copy-button:not(.increase-specificity.increase-specificity) {
  padding: $kui-space-20 $kui-space-40;
  border: $kui-border-width-10 solid $kui-color-border-neutral-weak;
  border-radius: $kui-border-radius-20;
}
</style>
