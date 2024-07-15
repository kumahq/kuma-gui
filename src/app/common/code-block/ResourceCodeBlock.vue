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
        <XDisclosure
          v-slot="{ expanded, toggle }"
        >
          <KCodeBlockIconButton
            :copy-tooltip="t('common.copyKubernetesText')"
            theme="dark"
            @click="() => {
              if (!expanded) {
                toggle()
              }
            }"
          >
            <XIcon name="copy" />{{ t('common.copyKubernetesShortText') }}
          </KCodeBlockIconButton>
          <XCopyButton
            v-slot="{ copy }"
            format="hidden"
          >
            <slot
              :copy="(cb: CopyCallback) => {
                if (expanded) {
                  toggle()
                }
                cb((text: Object) => copy(toYamlRepresentation(text)), (e: unknown) => console.error(e))
              }"
              :copying="expanded"
            />
          </XCopyButton>
        </XDisclosure>
      </template>
    </CodeBlock>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import CodeBlock from './CodeBlock.vue'
import { useI18n } from '@/utilities'
import { toYaml } from '@/utilities/toYaml'

type Resolve = (data: Object) => void
type CopyCallback = (resolve: Resolve, reject: (e: unknown) => void) => void

const { t } = useI18n()

const props = withDefaults(defineProps<{
  resource: Object
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
function toYamlRepresentation(resource: Object): string {
  if ('creationTime' in resource) {
    delete resource.creationTime
  }
  if ('modificationTime' in resource) {
    delete resource.modificationTime
  }
  return toYaml(resource)
}
</script>
