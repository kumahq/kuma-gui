<template>
  <KToggle
    v-slot="{ isToggled, toggle }"
    :toggled="false"
  >
    <CodeBlock
      language="yaml"
      :code="yamlUniversal"
      :is-searchable="props.isSearchable"
      :code-max-height="props.codeMaxHeight"
      :query="props.query"
      :is-filter-mode="props.isFilterMode"
      :is-reg-exp-mode="props.isRegExpMode"
      @query-change="emit('query-change', $event)"
      @filter-mode-change="emit('filter-mode-change', $event)"
      @reg-exp-mode-change="emit('reg-exp-mode-change', $event)"
    >
      <template #secondary-actions>
        <KTooltip
          class="kubernetes-copy-button-tooltip"
          :label="t('common.copyKubernetesText')"
          placement="bottomEnd"
          max-width="200"
          position-fixed
        >
          <CopyButton
            class="kubernetes-copy-button"
            :get-text="getYamlAsKubernetes"
            :copy-text="t('common.copyKubernetesText')"
            has-border
            hide-title
            @click="() => {
              if(isToggled.value === false) {
                toggle()
              }
            }"
          >
            {{ t('common.copyKubernetesShortText') }}
          </CopyButton>
        </KTooltip>
      </template>
    </CodeBlock>
    <slot
      :copy="(cb: CopyCallback) => {
        if(isToggled.value !== false) {
          toggle()
        }
        copy(cb)
      }"
      :copying="isToggled.value"
    />
  </KToggle>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

import CodeBlock from './CodeBlock.vue'
import CopyButton from './CopyButton.vue'
import type { SingleResourceParameters } from '@/types/api.d'
import type { Entity } from '@/types/index.d'
import { useI18n } from '@/utilities'
import { toYaml } from '@/utilities/toYaml'

type Resolve = (data: Entity) => void
type CopyCallback = (resolve: Resolve, reject: (e: unknown) => void) => void
type Copy = (cb: CopyCallback) => void

const { t } = useI18n()

const props = withDefaults(defineProps<{
  resource: Entity
  codeMaxHeight?: string
  isSearchable?: boolean
  query?: string
  isFilterMode?: boolean
  isRegExpMode?: boolean
}>(), {
  codeMaxHeight: undefined,
  isSearchable: false,
  query: '',
  isFilterMode: false,
  isRegExpMode: false,
})

const emit = defineEmits<{
  (event: 'query-change', query: string): void
  (event: 'filter-mode-change', isFilterMode: boolean): void
  (event: 'reg-exp-mode-change', isRegExpMode: boolean): void
}>()

const yamlUniversal = computed(() => toYamlRepresentation(props.resource))

const noop: Copy = () => {}

const copy = ref<Copy>(noop)
let p = new Promise((resolve: Resolve, reject) => { copy.value = (cb) => cb(resolve, reject) })

const fetcher = async (_params?: SingleResourceParameters): Promise<Entity> => {
  let res: Entity
  try {
    res = await p
  } finally {
    p = new Promise((resolve, reject) => { copy.value = (cb) => cb(resolve, reject) })
  }
  return res
}

async function getYamlAsKubernetes() {
  return toYamlRepresentation(await fetcher())
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
