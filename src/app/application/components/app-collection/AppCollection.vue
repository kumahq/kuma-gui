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

    <!-- Wraps “name” cells with a link to a collection’s summary or detail route to ensure there is a keyboard-navigable element in each row. -->
    <template
      v-if="hasNameColumn"
      #name="{ row, rowValue }"
    >
      <RouterLink
        v-if="getRoute"
        :to="getRoute(row)"
      >
        {{ rowValue }}
      </RouterLink>

      <template v-else>
        {{ rowValue }}
      </template>
    </template>

    <!-- Adds a “Go to details” link if a detail route is provided. -->
    <template
      v-if="hasDetailsColumn && props.getDetailRoute"
      #details="{ row }"
    >
      <RouterLink
        class="details-link"
        data-testid="details-link"
        :to="props.getDetailRoute(row)"
      >
        {{ t('common.collection.details_link') }}

        <ArrowRightIcon
          decorative
          display="inline-block"
          :size="KUI_ICON_SIZE_30"
        />
      </RouterLink>
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

    <template
      v-if="hasActionsColumn && $slots['actions-items']"
      #actions="{ row, rowValue }"
    >
      <KDropdown
        class="actions-dropdown"
        data-testid="actions-dropdown"
        :kpop-attributes="{ placement: 'bottomEnd' }"
        width="150"
      >
        <template #default>
          <KButton
            class="non-visual-button"
            appearance="secondary"
            icon-only
          >
            <MoreIcon />
          </KButton>
        </template>

        <template #items>
          <slot
            name="actions-items"
            :row="row"
            :row-value="rowValue"
          />
        </template>
      </KDropdown>
    </template>
  </KTable>
</template>

<script lang="ts" setup generic="Row extends {}">
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { AddIcon, ArrowRightIcon, MoreIcon } from '@kong/icons'
import { useSlots, ref, watch, Ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import DocumentationLink from '@/app/common/DocumentationLink.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import { useI18n } from '@/utilities'
import type { TableHeader } from '@kong/kongponents'
import type { RouteLocationRaw, RouteLocationNamedRaw } from 'vue-router'

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
const router = useRouter()
const slots = useSlots()

const SPECIAL_COLUMN_WIDTH = 5

const props = withDefaults(defineProps<{
  isSelectedRow?: ((row: Row) => boolean) | null
  getDetailRoute?: ((row: Row) => RouteLocationNamedRaw) | null
  getSummaryRoute?: ((row: Row) => RouteLocationNamedRaw) | null
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
  getDetailRoute: null,
  getSummaryRoute: null,
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

const getRoute = computed(() => props.getSummaryRoute ?? props.getDetailRoute)
const hasNameColumn = computed(() => props.headers.some((header) => header.key === 'name'))
const hasDetailsColumn = computed(() => props.headers.some((header) => header.key === 'details'))
const hasActionsColumn = computed(() => props.headers.some((header) => header.key === 'actions'))
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

const click = (event: MouseEvent, row: Row) => {
  let getRoute

  if (props.getSummaryRoute) {
    // Otherwise, prioritizes a summary route (if present)
    getRoute = props.getSummaryRoute
  } else {
    // Falls back to a detail route (if present)
    getRoute = props.getDetailRoute
  }

  if (getRoute) {
    router.push(getRoute(row))
  }
}
</script>

<style lang="scss" scoped>
.app-collection :deep(td:first-child),
.app-collection :deep(td:first-child > *) {
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

.actions-dropdown {
  display: inline-block;
}

.app-collection :deep(td) {
  width: var(--column-width, initial);
}

.app-collection :deep(.details-column),
.app-collection :deep(.warnings-column),
.app-collection :deep(.actions-column) {
  width: var(--special-column-width, initial);
  min-width: 80px;
  text-align: end;
}

.app-collection :deep(.is-selected) {
  background-color: $kui-color-background-neutral-weakest;
}
</style>
