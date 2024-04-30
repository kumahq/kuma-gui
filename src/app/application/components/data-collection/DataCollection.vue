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
        <EmptyBlock
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
      <EmptyBlock
        v-if="props.empty"
        :type="props.type"
      />
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
        @page-change="({ page }: PaginationChangeEvent) => {
          emit('change', {
            page,
            pageSize: props.pageSize,
          })
        }"
      />
    </slot>
  </template>
</template>
<script lang="ts" generic="T" setup>
import { computed, useSlots } from 'vue'

import EmptyBlock from '@/app/common/EmptyBlock.vue'
type PaginationChangeEvent = {
  page: number
}
const props = withDefaults(defineProps<{
  type?: string
  paginationType?: 'server' | 'client'
  page?: number
  pageSize?: number
  items: T[]
  predicate?: (item: T) => boolean
  comparator?: ((a: T, b: T) => number) | undefined
  find?: boolean // deprecated: please use the `item` slot
  empty?: boolean
}>(), {
  type: '',
  paginationType: 'server',
  page: 0,
  pageSize: 50,
  predicate: () => true,
  comparator: undefined,
  find: false,
  empty: true,
})
const emit = defineEmits<{
  (e: 'change', value: {page: number, pageSize: number}): void
  (e: 'error', error: Error): void
}>()
const slots = useSlots()
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
