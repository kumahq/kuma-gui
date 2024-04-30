<template>
  <div>
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
        <KCodeBlockIconButton
          :copy-tooltip="t('common.copyKubernetesText')"
          theme="dark"
          @click="async () => {
            if (!isCopying) {
              isCopying = true
              // Trigger an update of KCopy’s text
              text = toYamlRepresentation(await fetcher())
              // Wait a Vue tick for KCopy to have received the new text
              await nextTick()
              // Copy the text
              kCopyElement?.copy()
            }
          }"
        >
          <KCopy
            ref="kCopyElement"
            format="hidden"
            :text="text"
          />

          {{ t('common.copyKubernetesShortText') }}
        </KCodeBlockIconButton>
      </template>
    </CodeBlock>

    <slot
      :copy="(cb: CopyCallback) => {
        if (isCopying) {
          isCopying = false
        }
        copy(cb)
      }"
      :copying="isCopying"
    />
  </div>
</template>

<script lang="ts" setup>
import { KCopy } from '@kong/kongponents'
import { computed, nextTick, ref } from 'vue'

import CodeBlock from './CodeBlock.vue'
import type { SingleResourceParameters } from '@/types/api.d'
import type { Entity } from '@/types/index.d'
import { useI18n } from '@/utilities'
import { toYaml } from '@/utilities/toYaml'

type Resolve = (data: Entity) => void
type CopyCallback = (resolve: Resolve, reject: (e: unknown) => void) => void

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

const isCopying = ref(false)
const text = ref('')
const kCopyElement = ref<InstanceType<typeof KCopy> | null>(null)

const yamlUniversal = computed(() => toYamlRepresentation(props.resource))

// False negative. We should enable the TypeScript-specific linter rule, but that requires further changes.
// eslint-disable-next-line no-extra-parens
const copy = ref<(cb: CopyCallback) => void>(() => {})
let promise = new Promise((resolve: Resolve, reject) => {
  copy.value = (cb) => cb(resolve, reject)
})

const fetcher = async (_params?: SingleResourceParameters): Promise<Entity> => {
  try {
    // yes, this is one of those places where `return await` is important
    return await promise
  } finally {
    promise = new Promise((resolve, reject) => {
      copy.value = (cb) => cb(resolve, reject)
    })
  }
}

function toYamlRepresentation(resource: Entity): string {
  const { creationTime, modificationTime, ...resourceWithoutTimes } = resource

  return toYaml(resourceWithoutTimes)
}
</script>
