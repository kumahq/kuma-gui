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
        :data="allData as NullableArray<Data>"
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
} = never, const K extends unknown[] = []" setup
>
import { computed, ref, provide } from 'vue'

import type { NonNullableArray, NullableArray, TypeOf } from '../../../'
import DataSource from '../data-source/DataSource.vue'

type Data = TypeOf<T> extends never ? NonNullableArray<[...K]> : NonNullableArray<[TypeOf<T>, ...K]>

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
    data: NullableArray<Data>
    error: Error | undefined
    refresh: () => void
  }): any
}>()

provide('data-loader', {
  props,
})

const srcData = ref<TypeOf<T> | undefined>()
const srcError = ref<Error | undefined>()

/**
 * All data, including potentially the src data in index zero.
 * All elements can be undefined which means it's still connecting.
 */
const allData = computed(() => {
  const _srcData = typeof props.src === 'undefined' || props.src === '' ? [] : [srcData.value]
  const propsData = (props.data ?? []).filter(item => !(item instanceof Error)) as K
  return [
    ..._srcData,
    ...propsData,
  ]
})

/**
 * All errors, including potentially the src error in index zero.
 * `undefined`s are filtered out allowing allErrors.length checks.
 */
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

/**
 * The state will only ever be connecting if either props.src or props.data is set.
 * In any other case the state will only be error or default.
 */
const state = computed(() => {
  switch(true) {
    case allErrors.value.length > 0:
      return 'error'
    case allData.value.some(item => typeof item === 'undefined'):
      return 'connecting'
    default:
      return 'default'
  }
})

</script>
