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
        :data="d as D"
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
      v-else-if="allData.length === 0 || allData.every(item => typeof item !== 'undefined')"
    >
      <slot
        name="default"
        :data="d as D"
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
        :data="d as D"
        :error="srcError"
        :refresh="props.src !== '' ? refresh : () => {}"
      />
    </template>
  </DataSource>
</template>
<script lang="ts" generic="T extends string | {
  toString(): string
  typeOf(): any
}, K" setup
>
import { computed, ref, provide } from 'vue'

import type { TypeOf } from '../../../'

const props = withDefaults(defineProps<{
  data?: K[]
  errors?: (Error | undefined)[]
  src?: T
  loader?: boolean
  variant?: 'default' | 'list' | 'spinner'
}>(), {
  errors: undefined,
  data: undefined,
  src: undefined,
  loader: true,
  variant: 'default',
})

type Data = NonNullable<TypeOf<T>>
type D = 
  T extends undefined
    ? K[] extends undefined
      ? undefined                         // neither defined
      : K[]                               // only data defined
    : K[] extends undefined  
      ? NonNullable<TypeOf<T>>            // only src defined
      : [NonNullable<TypeOf<T>>, ...K[]]  // both src and data defined
type SrcType = typeof props.src
type DataType = typeof props.data
type DD = 
  SrcType extends undefined
    ? DataType extends undefined
      ? undefined                         // neither defined
      : DataType                               // only data defined
    : DataType extends undefined  
      ? NonNullable<TypeOf<T>>            // only src defined
      : [NonNullable<TypeOf<T>>, ...K[]]  // both src and data defined

defineSlots<{
  default(props: {
    data: D
    error: Error | undefined
    refresh: () => void
  }): any
  connecting(props: {
    data: undefined
    error: Error | undefined
    refresh: () => void
  }): any
  error(props: {
    data: D
    error: Error | undefined
    refresh: () => void
  }): any
  disconnected(props: {
    data: D
    error: Error | undefined
    refresh: () => void
  }): any
}>()

provide('data-loader', {
  props,
})


const srcData = ref<unknown>(undefined)
const srcError = ref<Error | undefined>(undefined)

const allData = computed(() => {
  const data = props.data?.filter(item => !(item instanceof Error)) ?? []
  /*
  if (props.src !== '') {
    return [srcData.value as unknown].concat(data)
  }
  */
  return data
})

const allErrors = computed(() => {
  const dataErrors = props.data?.filter(item => item instanceof Error) ?? []
  const errors = typeof srcError.value === 'undefined' ? props.errors : ([srcError.value] as (Error | undefined)[]).concat(props.errors)
  return (errors ?? []).concat(dataErrors).filter(<T>(item: T): item is NonNullable<T> => Boolean(item))
})

const d = computed(() => {
  const result = props.src && props.data?.length ? [srcData.value as NonNullable<TypeOf<T>>, ...allData.value]
  : props.src
    ? srcData.value as NonNullable<TypeOf<T>>
    : allData.value

  console.log({result, 'props.data': props.data, 'props.src': props.src})
  return result
})
/*
const d: D = props.src && props.data ? [srcData.value as NonNullable<TypeOf<T>>, ...allData.value] as D
  : props.src
    ? srcData.value as NonNullable<TypeOf<T>>
    : allData.value as D
*/

</script>
