<template>
  <XCodeBlock
    language="yaml"
    :code="yamlUniversal"
    :is-searchable="props.isSearchable"
    :max-height="props.maxHeight"
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
          v-if="props.showK8sCopyButton"
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
          format="hidden"
          v-slot="{ copy }"
        >
          <slot
            :copy="(cb: CopyCallback) => {
              if (expanded) {
                toggle()
              }
              cb((text: object) => copy(toYamlRepresentation(text)), onCopyReject)
            }"
            :copying="expanded"
          />
        </XCopyButton>
      </XDisclosure>
    </template>
  </XCodeBlock>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { useI18n, YAML } from '@/app/application'

type Resolve = (data: object) => void
type CopyCallback = (resolve: Resolve, reject: (e: unknown) => void) => void

const { t } = useI18n()

const props = withDefaults(defineProps<{
  resource: object
  maxHeight?: string
  isSearchable?: boolean
  query?: string
  isFilterMode?: boolean
  isRegExpMode?: boolean
  showK8sCopyButton?: boolean
}>(), {
  maxHeight: undefined,
  isSearchable: false,
  query: '',
  isFilterMode: false,
  isRegExpMode: false,
  showK8sCopyButton: true,
})

const emit = defineEmits<{
  (event: 'query-change', query: string): void
  (event: 'filter-mode-change', isFilterMode: boolean): void
  (event: 'reg-exp-mode-change', isRegExpMode: boolean): void
}>()

const yamlUniversal = computed(() => toYamlRepresentation(props.resource))
function toYamlRepresentation(resource: object): string {
  if ('creationTime' in resource) {
    delete resource.creationTime
  }
  if ('modificationTime' in resource) {
    delete resource.modificationTime
  }
  return YAML.stringify(resource)
}

const onCopyReject: Parameters<CopyCallback>[1] = (e: unknown) => console.error(e)
</script>
