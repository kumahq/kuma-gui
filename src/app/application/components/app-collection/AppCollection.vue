<template>
  <KTable
    :key="kTableMountKey"
    class="app-collection"
    :style="`--column-width: ${columnWidth}; --special-column-width: ${SPECIAL_COLUMN_WIDTH}%;`"
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
      return {data: items}
    }"
    :cell-attrs="({ headerKey }: CellAttrParams) => ({
      class: `${headerKey}-column`,
    })"
    :row-attrs="getRowAttributes"
    disable-sorting
    hide-pagination-when-optional
    @row:click="click"
  >
    <template
      v-if="props.items?.length === 0"
      #empty-state
    >
      <EmptyBlock>
        {{ props.emptyStateTitle ?? t('common.emptyState.title') }}

        <template
          v-if="props.emptyStateMessage"
          #message
        >
          {{ props.emptyStateMessage }}
        </template>

        <template
          v-if="props.emptyStateCtaTo"
          #cta
        >
          <DocumentationLink
            v-if="typeof props.emptyStateCtaTo === 'string'"
            :href="props.emptyStateCtaTo"
          >
            {{ props.emptyStateCtaText }}
          </DocumentationLink>

          <KButton
            v-else
            appearance="primary"
            :to="props.emptyStateCtaTo"
          >
            <AddIcon :size="KUI_ICON_SIZE_30" />

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
          :name="key"
          :row="row"
          :row-value="rowValue"
        />
      </template>
    </template>
  </KTable>
</template>

<script lang="ts" setup generic="Row extends {}">
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { AddIcon } from '@kong/icons'
import { KButton, KTable, TableHeader } from '@kong/kongponents'
import { useSlots, ref, watch, Ref, computed } from 'vue'
import { RouteLocationRaw } from 'vue-router'

import DocumentationLink from '@/app/common/DocumentationLink.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import { useI18n } from '@/utilities'

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

const { t } = useI18n()

const SPECIAL_COLUMN_WIDTH = 5

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
  pageNumber: 1,
  pageSize: 30,
  error: undefined,
  emptyStateTitle: undefined,
  emptyStateMessage: undefined,
  emptyStateCtaTo: undefined,
  emptyStateCtaText: undefined,
})

const emit = defineEmits<{
  (e: 'change', value: ChangeValue): void
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

const columnWidth = computed(() => {
  const specialColumns = props.headers.filter((header) => ['details', 'warnings', 'actions'].includes(header.key))

  if (specialColumns.length > 4) {
    return 'initial'
  }

  const percentage = 100 - specialColumns.length * SPECIAL_COLUMN_WIDTH
  const numberOfCommonColumns = props.headers.length - specialColumns.length
  return `calc(${percentage}% / ${numberOfCommonColumns})`
})

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
    const $a = $tr.querySelector('a')
    if ($a !== null) {
      $a.click()
    }
  }
}
</script>

<style lang="scss" scoped>
.app-collection :deep(td:first-child),
.app-collection :deep(td:first-child *) {
  color: inherit;
  font-weight: $kui-font-weight-semibold;
  text-decoration: none;
}

.app-collection-toolbar {
  display: flex;
  justify-content: flex-end;
  align-items: stretch;
  flex-wrap: wrap;
  gap: $kui-space-60;
  font-size: $kui-font-size-40;
}
</style>

<style lang="scss">
.app-collection td {
  width: var(--column-width, initial);
}

.app-collection .details-column,
.app-collection .warnings-column,
.app-collection .actions-column {
  width: var(--special-column-width, initial);
  min-width: 80px;
  text-align: end;
}

.app-collection .is-selected {
  background-color: $kui-color-background-neutral-weakest;
}
</style>
