<template>
  <slot
    v-if="items.length === 0"
    name="empty"
    :items="items"
  >
    <EmptyBlock />
  </slot>
  <slot
    v-else
    name="default"
    :items="paginated"
  />

  <slot
    v-if="props.page !== 0 && items.length > 0"
    name="pagination"
    :items="paginated"
  >
    <KPagination
      :total-count="items.length"
      :current-page="props.page"
      :initial-page-size="props.pageSize"
      :page-sizes="[15, 30, 50, 75, 100]"
      @page-changed="({ page }: PaginationChangeEvent) => {
        emit('change', {
          page,
          pageSize: props.pageSize,
        })
      }"
    />
  </slot>
</template>
<script lang="ts" generic="T extends {} = {}" setup>
import { computed } from 'vue'

import EmptyBlock from '@/app/common/EmptyBlock.vue'
type PaginationChangeEvent = {
  page: number
}
const props = withDefaults(defineProps<{
  // type: string
  paginationType?: 'server' | 'client'
  page?: number
  pageSize?: number
  items: T[]
  predicate?: (item: T) => boolean
  comparator?: ((item: T) => number) | undefined
  find?: boolean
}>(), {
  // type: '',
  paginationType: 'server',
  page: 0,
  pageSize: 50,
  predicate: () => true,
  comparator: undefined,
  find: false,
})
const emit = defineEmits<{
  (e: 'change', value: {page: number, pageSize: number}): void
  (e: 'error', error: Error): void
}>()
const items = computed(() => {
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
