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
        :data="data as Data"
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
        :data="data as NonNullableData<Data>"
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

import type { NonNullableArray, NullableArray, TypeOf } from '../../../'
import DataSource from '../data-source/DataSource.vue'

// We need to prevent distributive conditional types here (i.e. therefore wrapping TSrc in [] and others)
type InferredDataType<TSrc, TData extends any[]> = 
  [TSrc] extends [never]
    ? [TData] extends [never]
      ? undefined
      : NullableArray<TData>
    : [TData] extends [never]
      ? TSrc | undefined
      : TData extends [...infer Items]
        ? NullableArray<[TSrc, ...Items]>
        : undefined

type NonNullableData<T> = T extends [...infer U] ? NonNullableArray<U> : NonNullable<T>
type Data = InferredDataType<TypeOf<T>, K>

const props = withDefaults(defineProps<{
  src?: T
  data?: K // (K | undefined)[]
  errors?: (Error | undefined)[]
  variant?: 'default' | 'list' | 'spinner'
}>(), {
  src: undefined,
  data: undefined,
  errors: undefined,
  variant: 'default',
})

defineSlots<{
  default(props: {
    data: NonNullableData<Data>
    error: Error | undefined
    refresh: () => void
  }): any
  connecting(props: {
    data: undefined
    error: Error | undefined
    refresh: () => void
  }): any
  error(props: {
    data: Data
    error: Error | undefined
    refresh: () => void
  }): any
}>()

provide('data-loader', {
  props,
})

const srcData = ref<TypeOf<T> | undefined>()
const srcError = ref<Error | undefined>()
  
// all data, including potentially the src data in index zero.
// all elements can be undefined which means its still connecting
const allData = computed(() => {
  const _srcData = typeof props.src === 'undefined' || props.src === '' ? [] : [srcData.value]
  const propsData = (props.data ?? []).filter(item => !(item instanceof Error)) as K
  return [
    ..._srcData,
    ...propsData,
  ]
})

// all errors, including potentially the src error in index zero.
// undefineds are filtered out allowing allErrors.length checks
const allErrors = computed(() => {
  // gather everything that can be erroneous
  const srcErrors = typeof props.src === 'undefined' ? [] : [srcError.value]
  const dataErrors = (props.data ?? []).filter((item) => item instanceof Error) as Error[]
  const propsErrors = props.errors ?? []
  // squeeze it all together
  return [
    ...srcErrors,
    ...dataErrors,
    ...propsErrors,
  ].filter((item) => !!item)
})

const data = computed(() => {
  return typeof props.data === 'undefined' ? allData.value[0] : allData.value
})

// The state will only ever be connecting if either props.src or props.data is set.
// In any other case the state will only be error or default.
const state = computed<'error' | 'connecting' | 'default'>(() => {
  switch(true) {
    case allErrors.value.length > 0:
      return 'error' as const
    case allData.value.some(item => typeof item === 'undefined'):
      return 'connecting' as const
    default:
      return 'default' as const
  }
})

</script>
