<template>
  <KTable
    data-testid="app-collection"
    class="app-collection"
    :headers="props.headers"
    :fetcher-cache-key="String(cacheKey)"
    :fetcher="() => {
      return { data: props.items }
    }"
    :cell-attrs="({ headerKey }: CellAttrParams) => ({
      class: `${headerKey}-column`,
    })"
    :row-attrs="getRowAttributes"
    :disable-sorting="true"
    :disable-pagination="true"
    :resize-columns="true"
    :table-preferences="{
      columnWidths: props.headers.reduce<Record<string, number>>((prev, value) => {
        if(typeof value.width !== 'undefined') {
          prev[value.key] = value.width
        }
        return prev
      }, {}),
    }"
    :loading="typeof props.items === 'undefined'"
    @row:click="click"
    @update:table-preferences="resize"
  >
    <template
      v-for="key in Object.keys(slots)"
      :key="key"
      #[key]="{ row, rowValue }"
    >
      <slot
        v-if="(props.items ?? []).length > 0"
        :name="key"
        :row="row as Row"
        :row-value="rowValue"
      />
    </template>
  </KTable>
</template>

<script lang="ts" setup generic="Row extends {}">
import { KTable } from '@kong/kongponents'
import { useSlots, ref, watch, Ref, inject } from 'vue'

import { runInDebug } from '../../'
import type { TableHeader as KTableHeader, TablePreferences } from '@kong/kongponents'
type CellAttrParams = {
  headerKey: string
  row: Row
  rowIndex: number
  colIndex: number
}
type ResizeValue = {
  headers: Record<string, { width: number }>
}

type TableHeader = KTableHeader & {
  width?: number
}

// when we are inside of a DataLoader make sure its using the `variant="list"`
// but only error in dev mode, if this fails in production we don't want things
// to blow up
const dataLoader = inject<{ props: { variant: string } } | undefined>('data-loader')
if (typeof dataLoader !== 'undefined') {
  if (dataLoader.props.variant !== 'list') {
    runInDebug(() => {
      // throw new Error('Please use <DataLoader variant="list" />')
    })
  }
}
//
const props = withDefaults(defineProps<{
  isSelectedRow?: ((row: Row) => boolean)
  items: Row[] | undefined
  headers: TableHeader[]
}>(), {
  isSelectedRow: undefined,
})

const emit = defineEmits<{
  (e: 'resize', value: ResizeValue): void
}>()

const slots = useSlots()

const items = ref(props.items) as Ref<typeof props.items>
const cacheKey = ref<number>(0)

const resize = (args: TablePreferences) => {
  const headers = Object.entries(args.columnWidths ?? {}).reduce<Record<string, { width: number }>>((prev, [key, value]) => {
    prev[key] = {
      width: value,
    }
    return prev
  }, {})

  emit('resize', {
    headers,
  })
}

watch(() => props.items, (newItems, oldItems) => {
  if (newItems !== oldItems) {
    cacheKey.value++
    items.value = props.items
  }
})

function getRowAttributes(row: Row): Record<string, string> {
  if (!row) {
    return {}
  }

  const attributes: Record<string, string> = {}

  if (typeof props.isSelectedRow !== 'undefined' && props.isSelectedRow(row)) {
    attributes.class = 'is-selected'
  }

  return attributes
}
const click = (e: MouseEvent) => {
  const $tr = (e.target as HTMLElement).closest('tr')
  if ($tr) {
    const $a: HTMLAnchorElement | null = ['td:first-child a', '[data-action]'].reduce<HTMLAnchorElement | null>((prev, item) => {
      if (prev === null) {
        return $tr.querySelector(item)
      }
      return prev
    }, null)
    if ((window.getSelection()?.isCollapsed ?? true) && $a !== null && $a.closest('tr, li') === $tr) {
      e.preventDefault()
      $a.click()
    }
  }
}
</script>

<style lang="scss" scoped>
.app-collection :deep(td:first-child a) {
  color: inherit;
  font-weight: $kui-font-weight-semibold;
  text-decoration: none;
}
.app-collection :deep(td:first-child li a) {
  color: $kui-color-text-primary;
  font-weight: $kui-font-weight-regular;
}
.app-collection :deep(td:first-child li a:hover) {
  text-decoration: underline;
}
</style>

<style lang="scss">

.app-collection .actions-column {
  width: 48px;
}
.app-collection .is-selected {
  background-color: $kui-color-background-neutral-weakest;
}
</style>
