<template>
  <KTable
    class="app-collection"
    :has-error="(typeof props.error !== 'undefined')"
    :pagination-total-items="props.total"
    :initial-fetcher-params="{ page: props.pageNumber, pageSize: props.pageSize }"
    :fetcher-cache-key="String(cacheKey)"
    :fetcher="({ page, pageSize, query }: FetcherParams) => {
      emit('change', {
        page: page,
        size: pageSize,
        s: query
      })
      return {data: items}
    }"
    :cell-attrs="({ headerKey }: CellAttrParams) => ({
      class: `${headerKey}-column`
    })"
    empty-state-icon-size="96"
    disable-sorting
    hide-pagination-when-optional
    @row:click="click"
  >
    <template
      v-for="key in Object.keys(slots)"
      :key="key"
      #[key]="{ row, rowValue }"
    >
      <template
        v-if="key === 'toolbar'"
      >
        <div class="app-collection-toolbar">
          <slot name="toolbar" />
        </div>
      </template>

      <template v-else>
        <slot
          :name="key"
          :row="row"
          :row-value="rowValue"
        />
      </template>
    </template>
  </KTable>
</template>

<script lang="ts" setup>
import {
  KTable,
} from '@kong/kongponents'
import { useSlots, ref, watch } from 'vue'

type CellAttrParams = {
  headerKey: string
  row: any
  rowIndex: number
  colIndex: number
}
type FetcherParams = {
  page: number,
  pageSize: number,
  query: string
}
type ChangeValue = {
  page: number,
  size: number
  s: string
}

const props = withDefaults(defineProps<{
  total?: number,
  pageNumber: number,
  pageSize: number,
  items: unknown[] | undefined,
  error: Error | undefined,
}>(), {
  total: 0,
})

const emit = defineEmits<{
  (e: 'change', value: ChangeValue): void
}>()

const slots = useSlots()

const items = ref<unknown[] | undefined>(props.items)
const cacheKey = ref<number>(0)

watch(() => props.items, () => {
  cacheKey.value++
  items.value = props.items
})
const click = (e: MouseEvent) => {
  const $tr = (e.target as HTMLElement).closest('tr')
  if ($tr) {
    const $a = $tr.querySelector('a')
    if ($a !== null) {
      $a.click()
    }
  }
}
</script>
<style type="scss" scoped>
.app-collection :deep(td:first-of-type > a) {
  color: inherit;
  font-weight: var(--font-weight-semi-bold);
  text-decoration: none;
}

.app-collection-toolbar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-sm) 0 var(--spacing-sm);
  font-size: var(--type-md);
  color: var(--black-500);
}
</style>
