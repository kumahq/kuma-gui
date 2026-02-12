<template>
  <DataSource
    :src="props.src ?? ''"
    @change="(data: TypeOf<T>) => srcData = data"
    @error="(e: Error) => srcError = e"
    v-slot="{ refresh }"
  >
    <template
      v-if="state === 'error'"
    >
      <slot
        name="error"
        :data="allData"
        :error="allErrors[0]"
        :refresh="typeof props.src !== 'undefined' ? refresh : () => {}"
      >
        <XErrorState
          v-bind="$attrs"
          :error="allErrors[0]"
        />
      </slot>
    </template>

    <template v-else-if="state === 'connecting'">
      <slot
        name="connecting"
        :data="undefined"
        :error="srcError"
        :refresh="typeof props.src !== 'undefined' ? refresh : () => {}"
      >
        <XProgress
          v-bind="$attrs"
          :variant="props.variant === 'default' ? 'legacy' : props.variant"
        />
      </slot>
    </template>
    
    <template
      v-else-if="state === 'default'"
    >
      <slot
        name="default"
        :data="allData as Data"
        :error="srcError"
        :refresh="typeof props.src !== 'undefined' ? refresh : () => {}"
      />
    </template>
  </DataSource>
</template>
<script lang="ts" generic="T extends string | {
  toString(): string
  typeOf(): any
} = never, const K extends unknown[] = never" setup
>
import { computed, ref, provide } from 'vue'

import type { NonNullableArray, TypeOf } from '../../../'
import DataSource from '../data-source/DataSource.vue'

// We need to prevent distributive conditional types here (i.e. therefore wrapping TSrc in [] and others)
type InferredDataType<TSrc, TData extends any[]> = 
  [TSrc] extends [never]
    ? [TData] extends [never]
      ? undefined
      : NonNullableArray<TData>
    : [TData] extends [never]
      ? NonNullable<TSrc>
      : TData extends [...infer Items]
        ? [NonNullable<TSrc>, ...NonNullableArray<Items>]
        : undefined

type Data = InferredDataType<TypeOf<T>, K>

const props = withDefaults(defineProps<{
  src?: T
  // TODO: check wether we can use `K[]` here instead of plain `K` to make it more clear that `data` is an array
  data?: K // (K | undefined)[]
  errors?: (Error | undefined)[]
  variant?: 'default' | 'list' | 'spinner'
}>(), {
  src: undefined,
  data: undefined,
  errors: undefined,
  variant: 'default',
})

provide('data-loader', {
  props,
})

const srcData = ref<unknown>()
const srcError = ref<Error | undefined>()

const allData = computed(() => {
  const propsData = (props.data ?? []).filter(item => !(item instanceof Error))
  const data = typeof props.src === 'undefined' ? propsData : [srcData.value].concat(propsData)
  return data
})

const allErrors = computed(() => {
  const dataErrors = (props.data ?? []).filter(item => item instanceof Error) as Error[]
  const errors = typeof srcError.value === 'undefined' ? props.errors : ([srcError.value] as (Error | undefined)[]).concat(props.errors)
  return [...(errors ?? []), ...dataErrors].filter(<T>(item: T): item is NonNullable<T> => Boolean(item))
})

const state = computed<'error' | 'connecting' | 'default'>(() => {
  switch(true) {
    case allErrors.value.length > 0:
      return 'error' as const
    case (typeof props.src !== 'undefined' || typeof props.data !== 'undefined') && allData.value.some(item => typeof item === 'undefined'):
      return 'connecting' as const
    default:
      return 'default' as const
  }
})

defineSlots<{
  default(props: {
    data: Data
    error: Error | undefined
    refresh: () => void
  }): any
  connecting(props: {
    data: undefined
    error: Error | undefined
    refresh: () => void
  }): any
  // TODO: construct a proper type alias for `typeof`
  error(props: {
    data: typeof allData.value
    error: Error | undefined
    refresh: () => void
  }): any
}>()

</script>
