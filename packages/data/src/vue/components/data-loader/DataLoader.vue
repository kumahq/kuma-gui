<template>
  <DataSource
    :src="props.src as T"
    @change="(data: TypeOf<T>) => srcData = data"
    @error="(e: Error) => srcError = e"
    v-slot="{ refresh }"
  >
    <template
      v-if="allErrors.length > 0"
    >
      <slot
        name="error"
        :data="allData as Data"
        :error="allErrors[0]"
        :refresh="props.src !== '' ? refresh : () => {}"
      >
        <XErrorState
          v-bind="$attrs"
          :error="allErrors[0]"
        />
      </slot>
    </template>
    <template
      v-else-if="typeof allData !== 'undefined'"
    >
      <slot
        name="default"
        :data="allData as Data"
        :error="srcError"
        :refresh="props.src !== '' ? refresh : () => {}"
      />
    </template>

    <template v-else>
      <slot
        v-if="props.loader"
        name="connecting"
        :data="undefined"
        :error="srcError"
        :refresh="props.src !== '' ? refresh : () => {}"
      >
        <XProgress
          v-if="(props.data ?? []).length > 0 || props.src !== ''"
          v-bind="$attrs"
          :variant="props.variant === 'default' ? 'legacy' : props.variant"
        />
      </slot>
      <slot
        v-else
        name="default"
        :data="undefined as unknown as Data"
        :error="srcError"
        :refresh="props.src !== '' ? refresh : () => {}"
      />
    </template>
  </DataSource>
</template>
<script lang="ts" generic="T extends string | {
  toString(): string
  typeOf(): any
} = never, K extends unknown[] = never" setup
>
import { computed, ref, provide } from 'vue'

import type { TypeOf } from '../../../'

const props = withDefaults(defineProps<{
  src?: T
  data?: K
  errors?: (Error | undefined)[]
  loader?: boolean
  variant?: 'default' | 'list' | 'spinner'
}>(), {
  errors: undefined,
  data: undefined,
  src: undefined,
  loader: true,
  variant: 'default',
})

const srcData = ref<unknown>(undefined)
const srcError = ref<Error | undefined>(undefined)

const allData = computed(() => {
  const data = (props.data ?? []).filter(item => !(item instanceof Error)) as K
  if(!data.every(item => typeof item !== 'undefined') || (props.src && typeof srcData.value === 'undefined')) {
    return undefined
  }
  if (data.length > 0 && typeof srcData.value === 'undefined') {
    return data
  }
  if (data.length === 0 && typeof srcData.value !== 'undefined') {
    return srcData.value as NonNullable<TypeOf<T>>
  }
  if (data.length > 0 && typeof srcData.value !== 'undefined') {
    return [srcData.value as NonNullable<TypeOf<T>>, ...data]
  }
  return undefined
})

const allErrors = computed(() => {
  const dataErrors = (props.data ?? []).filter(item => item instanceof Error) as Error[]
  const errors = typeof srcError.value === 'undefined' ? props.errors : ([srcError.value] as (Error | undefined)[]).concat(props.errors)
  return [...(errors ?? [])].concat(dataErrors).filter(<T>(item: T): item is NonNullable<T> => Boolean(item))
})

type RemoveUndefined<T extends any[]> = {
  [K in keyof T]: Exclude<T[K], undefined>
}

type InferredDataType<TSrc, TData extends any[]> = 
  [TSrc] extends [never]
    ? [TData] extends [never]
      ? undefined
      : RemoveUndefined<TData>
    : [TData] extends [never]
      ? NonNullable<TSrc>
      : TData extends [...infer Items]
        ? [NonNullable<TSrc>, ...RemoveUndefined<Items>]
        : undefined

type Data = InferredDataType<TypeOf<T>, K>

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
  error(props: {
    data: Data
    error: Error | undefined
    refresh: () => void
  }): any
  disconnected(props: {
    data: Data
    error: Error | undefined
    refresh: () => void
  }): any
}>()

provide('data-loader', {
  props,
})

</script>
