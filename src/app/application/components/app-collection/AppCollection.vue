<template>
  <KTable
    :key="kTableMountKey"
    data-testid="app-collection"
    class="app-collection"
    :has-error="(typeof props.error !== 'undefined')"
    :pagination-total-items="props.total"
    :initial-fetcher-params="{ page: props.pageNumber, pageSize: props.pageSize }"
    :headers="props.headers"
    :fetcher-cache-key="String(cacheKey)"
    :fetcher="({ page, pageSize, query: _query }: FetcherParams) => {
      const value: ChangeValue = {}
      if(lastPageNumber !== page) {
        value.page = page;
      }
      if(lastPageSize !== pageSize) {
        value.size = pageSize;
      }
      lastPageNumber = page
      lastPageSize = pageSize
      if(Object.keys(value).length > 0) {
        emit('change', value)
      }
      return { data: props.items }
    }"
    :cell-attrs="({ headerKey }: CellAttrParams) => ({
      class: `${headerKey}-column`,
    })"
    :row-attrs="getRowAttributes"
    disable-sorting
    :disable-pagination="props.pageNumber === 0"
    hide-pagination-when-optional
    resize-columns
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
      v-if="props.items?.length === 0"
      #empty-state
    >
      <EmptyBlock>
        <template #title>
          {{ props.emptyStateTitle ?? t('common.emptyState.title') }}
        </template>

        <template v-if="props.emptyStateMessage">
          {{ props.emptyStateMessage }}
        </template>

        <template
          v-if="props.emptyStateCtaTo"
          #action
        >
          <XAction
            v-if="typeof props.emptyStateCtaTo === 'string'"
            action="docs"
            :href="props.emptyStateCtaTo"
          >
            {{ props.emptyStateCtaText }}
          </XAction>

          <KButton
            v-else
            appearance="primary"
            :to="props.emptyStateCtaTo"
          >
            <AddIcon />

            {{ props.emptyStateCtaText }}
          </KButton>
        </template>
      </EmptyBlock>
    </template>

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
          v-if="(props.items ?? []).length > 0"
          :name="key"
          :row="row as Row"
          :row-value="rowValue"
        />
      </template>
    </template>
  </KTable>
</template>

<script lang="ts" setup generic="Row extends {}">
import { AddIcon } from '@kong/icons'
import { KButton, KTable } from '@kong/kongponents'
import { useSlots, ref, watch, Ref } from 'vue'
import { RouteLocationRaw } from 'vue-router'

import { useI18n } from '@/app/application'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import type { TableHeader as KTableHeader, TablePreferences } from '@kong/kongponents'

type CellAttrParams = {
  headerKey: string
  row: Row
  rowIndex: number
  colIndex: number
}
type FetcherParams = {
  page: number
  pageSize: number
  query: string
}
type ChangeValue = {
  page?: number
  size?: number
}
type ResizeValue = {
  headers: Record<string, { width: number }>
}

const { t } = useI18n()

type TableHeader = KTableHeader & {
  width?: number
}
const props = withDefaults(defineProps<{
  isSelectedRow?: ((row: Row) => boolean) | null
  total?: number
  pageNumber?: number
  pageSize?: number
  items: Row[] | undefined
  headers: TableHeader[]
  error?: Error | undefined
  emptyStateTitle?: string
  emptyStateMessage?: string
  emptyStateCtaTo?: string | RouteLocationRaw
  emptyStateCtaText?: string
}>(), {
  isSelectedRow: null,
  total: 0,
  pageNumber: 0,
  pageSize: 30,
  error: undefined,
  emptyStateTitle: undefined,
  emptyStateMessage: undefined,
  emptyStateCtaTo: undefined,
  emptyStateCtaText: undefined,
})

const emit = defineEmits<{
  (e: 'change', value: ChangeValue): void
  (e: 'resize', value: ResizeValue): void
}>()

const slots = useSlots()

const items = ref(props.items) as Ref<typeof props.items>
const cacheKey = ref<number>(0)
/**
 * Used as a means to instruct KTable to re-mount.
 *
 * This is a hack around the fact that there is no other way to tell KTable if
 * the current page of a paginated view has changed. KTable assumes it’s the
 * *sole* owner/maintainer of pagination-related state, but that’s a design
 * flaw that doesn’t account for browser history navigation (e.g. pressing back
 * to go from page 2 to page 1).
 *
 * Is triggered via a watcher whenever `props.pageNumber` changes while the
 * last page number that was emitted by KTable (via calls to its `fetcher`
 * prop) is different (i.e. the page number has changed independently of a
 * KTable mechanism).
 */
const kTableMountKey = ref(0)
const lastPageNumber = ref(props.pageNumber)
const lastPageSize = ref(props.pageSize)

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

watch(() => props.pageNumber, function () {
  if (props.pageNumber !== lastPageNumber.value) {
    kTableMountKey.value++
  }
})
watch(() => props.headers, function (val, prev) {
  if (JSON.stringify(val) !== JSON.stringify(prev)) {
    kTableMountKey.value++
  }
})

function getRowAttributes(row: Row): Record<string, string> {
  if (!row) {
    return {}
  }

  const attributes: Record<string, string> = {}

  if (props.isSelectedRow !== null && props.isSelectedRow(row)) {
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
    if ($a !== null && $a.closest('tr, li') === $tr) {
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
.app-collection-toolbar {
  display: flex;
  justify-content: flex-end;
  align-items: stretch;
  flex-wrap: wrap;
  gap: $kui-space-60;
  font-size: $kui-font-size-40;
  width: 100%;
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
