<template>
  <div>
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
          <KClipboardProvider v-slot="{ copyToClipboard }">
            <KCodeBlockIconButton
              :copy-tooltip="t('common.copyKubernetesText')"
              theme="dark"
              @click="async () => {
                if (isToggled.value === false) {
                  toggle()
                  const text = toYamlRepresentation(await fetcher())
                  await copyToClipboard(text)
                }
              }"
            >
              <CopyIcon />

              {{ t('common.copyKubernetesShortText') }}
            </KCodeBlockIconButton>
          </KClipboardProvider>
        </template>
      </CodeBlock>

      <slot
        :copy="(cb: CopyCallback) => {
          if (isToggled.value !== false) {
            toggle()
          }
          copy(cb)
        }"
        :copying="isToggled.value"
      />
    </KToggle>
  </div>
</template>

<script lang="ts" setup>
import { CopyIcon } from '@kong/icons'
import { computed, ref } from 'vue'

import CodeBlock from './CodeBlock.vue'
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
let promise = new Promise((resolve: Resolve, reject) => {
  copy.value = (cb) => cb(resolve, reject)
})

const fetcher = async (_params?: SingleResourceParameters): Promise<Entity> => {
  let res: Entity
  try {
    res = await promise
  } finally {
    promise = new Promise((resolve, reject) => {
      copy.value = (cb) => cb(resolve, reject)
    })
  }
  return res
}

function toYamlRepresentation(resource: Entity): string {
  const { creationTime, modificationTime, ...resourceWithoutTimes } = resource

  return toYaml(resourceWithoutTimes)
}
</script>
