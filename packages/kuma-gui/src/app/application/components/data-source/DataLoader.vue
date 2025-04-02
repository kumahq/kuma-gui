<template>
  <DataSource
    :src="props.src as T"
    @change="(data) => srcData = data"
    @error="(e: Error) => srcError = e"
    v-slot="{ refresh }"
  >
    <template
      v-if="allData.length > 0 && allData.every(item => typeof item !== 'undefined')"
    >
      <!-- if the data is loaded and then we get an error -->
      <!-- keep the old data visible but also show a disconnected slot -->
      <template
        v-if="allErrors.length > 0"
      >
        <slot
          name="disconnected"
          :data="srcData as NonNullable<TypeOf<T>>"
          :error="allErrors[0]"
          :refresh="props.src !== '' ? refresh : () => {}"
        >
          <!-- XAlert -->
        </slot>
      </template>
      <slot
        name="loadable"
        :data="srcData as TypeOf<T>"
        :error="srcError"
        :refresh="props.src !== '' ? refresh : () => {}"
      />
      <slot
        name="default"
        :data="srcData as NonNullable<TypeOf<T>>"
        :error="srcError"
        :refresh="props.src !== '' ? refresh : () => {}"
      />
    </template>

    <template
      v-else-if="allErrors.length > 0"
    >
      <slot
        name="error"
        :data="srcData as TypeOf<T>"
        :error="allErrors[0]"
        :refresh="props.src !== '' ? refresh : () => {}"
      >
        <ErrorBlock
          v-bind="$attrs"
          :error="allErrors[0]"
        />
      </slot>
    </template>
    <template
      v-else
    >
      <slot
        name="loadable"
        :data="srcData as TypeOf<T>"
        :error="srcError"
        :refresh="props.src !== '' ? refresh : () => {}"
      />
      <slot
        v-if="props.loader && typeof slots.loadable === 'undefined'"
        name="connecting"
        :data="undefined"
        :error="srcError"
        :refresh="props.src !== '' ? refresh : () => {}"
      >
        <XProgress
          v-if="props.src !== ''"
          v-bind="$attrs"
          :variant="props.variant === 'default' ? 'legacy' : props.variant"
        />
      </slot>
      <slot
        v-else
        name="default"
        :data="srcData as NonNullable<TypeOf<T>>"
        :error="srcError"
        :refresh="props.src !== '' ? refresh : () => {}"
      />
    </template>
  </DataSource>
</template>
<script lang="ts" generic="T extends string | {
  toString(): string
  typeOf(): any
}" setup
>
import { computed, ref, provide } from 'vue'

import type { TypeOf } from '@/app/application'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
const props = withDefaults(defineProps<{
  data?: unknown[]
  errors?: (Error | undefined)[]
  src?: T
  loader?: boolean
  variant?: 'default' | 'list' | 'spinner'
}>(), {
  errors: () => [],
  data: () => [],
  src: '' as any,
  loader: true,
  variant: 'default',
})
const slots = defineSlots<{
  default(props: {
    data: NonNullable<TypeOf<T>>
    error: Error | undefined
    refresh: () => void
  }): any
  connecting(props: {
    data: undefined
    error: Error | undefined
    refresh: () => void
  }): any
  error(props: {
    data: NonNullable<TypeOf<T>>
    error: Error | undefined
    refresh: () => void
  }): any
  disconnected(props: {
    data: NonNullable<TypeOf<T>>
    error: Error | undefined
    refresh: () => void
  }): any
  loadable(props: {
    data: NonNullable<TypeOf<T>>
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
  if (props.src !== '') {
    return [srcData.value as unknown].concat(props.data)
  }
  return props.data
})

const allErrors = computed(() => {
  const errors = typeof srcError.value === 'undefined' ? props.errors : ([srcError.value] as (Error | undefined)[]).concat(props.errors)
  return errors.filter(<T>(item: T): item is NonNullable<T> => Boolean(item))
})

</script>
