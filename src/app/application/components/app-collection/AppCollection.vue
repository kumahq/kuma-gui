<template>
  <KTable
    class="app-collection"
    :style="`--column-width: ${columnWidth}; --special-column-width: ${SPECIAL_COLUMN_WIDTH}%;`"
    :has-error="(typeof props.error !== 'undefined')"
    :pagination-total-items="props.total"
    :initial-fetcher-params="{ page: props.pageNumber, pageSize: props.pageSize }"
    :headers="props.headers"
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
import { KTable, TableHeader } from '@kong/kongponents'
import { useSlots, ref, watch, computed } from 'vue'

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

const SPECIAL_COLUMN_WIDTH = 5

const props = withDefaults(defineProps<{
  total?: number,
  pageNumber: number,
  pageSize: number,
  items: unknown[] | undefined,
  headers: TableHeader[],
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

const columnWidth = computed(() => {
  const specialColumns = props.headers.filter((header) => ['warnings', 'actions'].includes(header.key))

  if (specialColumns.length > 4) {
    return 'initial'
  }

  const percentage = 100 - specialColumns.length * SPECIAL_COLUMN_WIDTH
  const numberOfCommonColumns = props.headers.length - specialColumns.length
  return `calc(${percentage}% / ${numberOfCommonColumns})`
})

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
  align-items: stretch;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  font-size: var(--type-md);
  color: var(--black-500);
}
</style>

<style type="scss">
.app-collection td {
  width: var(--column-width, initial);
}

.app-collection .warnings-column,
.app-collection .actions-column {
  width: var(--special-column-width, initial);
  min-width: 80px;
  text-align: end;
}
</style>
