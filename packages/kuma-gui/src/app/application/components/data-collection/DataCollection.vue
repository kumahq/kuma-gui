<template>
  <template
    v-if="slots.item"
  >
    <template
      v-for="item in [props.items.find(props.predicate)]"
      :key="item"
    >
      <slot
        v-if="item"
        name="item"
        :item="item as T"
      />
      <slot
        v-else
        name="empty"
        :items="items"
      >
        <XEmptyState
          v-if="props.empty"
          :type="props.type"
        />
      </slot>
    </template>
  </template>

  <template
    v-else
  >
    <slot
      v-if="items.length === 0"
      name="empty"
      :items="items"
    >
      <XEmptyState
        v-if="props.empty"
        :type="props.type"
      />
    </slot>

    <XLayout
      v-else
      class="data-collection"
      type="stack"
    >
      <div>
        <slot
          name="default"
          :items="paginated"
        />
      </div>
      <div
        v-if="typeof props.items?.[0] !== 'undefined' && !(props.page === 0 && props.pageSize === 0 && props.total === 0)"
      >
        <slot
          name="pagination"
          :items="paginated"
        >
          <KPagination
            :class="{
              pagination: true,
              'with-paging': props.page !== 0 && props.total > 0 && props.total !== props.items.length,
              'with-sizing': props.pageSize !== 0,
            }"
            :total-count="props.total"
            :current-page="props.page"
            :initial-page-size="props.pageSize || props.total"
            :page-sizes="[15, 30, 50, 75, 100]"
            @page-change="({ page }: PaginationChangeEvent) => {
              change({
                page,
                size: props.pageSize,
              })
            }"
            @page-size-change="({ pageSize }: SizeChangeEvent) => {
              // update page alongside new pageSize such that users can continue to watch on the same resource chunk
              const offset = props.pageSize * Math.max(props.page - 1, 0)
              const page = Math.floor(offset / pageSize) + 1
              change({
                page: page,
                size: pageSize,
              })
            }"
          />
        </slot>
      </div>
    </XLayout>
  </template>
</template>
<script lang="ts" generic="T" setup>
import { useThrottleFn } from '@vueuse/core'
import { computed, useSlots } from 'vue'

type PaginationChangeEvent = {
  page: number
}
type SizeChangeEvent = {
  pageSize: number
}
const props = withDefaults(defineProps<{
  type?: string
  paginationType?: 'server' | 'client'
  page?: number
  pageSize?: number
  total?: number
  items: T[]
  predicate?: (item: T) => boolean
  comparator?: ((a: T, b: T) => number) | undefined
  find?: boolean // deprecated: please use the `item` slot
  empty?: boolean
}>(), {
  type: '',
  paginationType: 'server',
  page: 0,
  total: 0,
  pageSize: 0,
  predicate: () => true,
  comparator: undefined,
  find: false,
  empty: true,
})
const emit = defineEmits<{
  (e: 'change', value: {page: number, size: number}): void
  (e: 'error', error: Error): void
}>()
const slots = useSlots()

const change = useThrottleFn((obj) => {
  emit('change', obj)
})

const items = computed(() => {
  if (slots.item) {
    return props.items
  }
  if (props.find) {
    const found = props.items.find(props.predicate)
    return typeof found === 'undefined' ? [] : [found]
  } else {
    const found = props.items.filter(props.predicate)
    if (typeof props.comparator !== 'undefined') {
      return found.sort(props.comparator)
    }
    return found
  }
})
const paginated = computed(() => {
  if (props.paginationType === 'client') {
    const cursor = props.pageSize * (props.page - 1)
    return items.value.slice(cursor, cursor + props.pageSize)
  } else {
    return items.value
  }
})

</script>
<style lang="scss" scoped>
.pagination:not(.with-paging) :deep(.pagination-button-container) {
  display: none;
}
.pagination:not(.with-sizing) :deep(.page-size-select) {
  display: none;
}
</style>
