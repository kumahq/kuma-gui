<template>
  <DataSource
    v-slot="{ refresh }"
    :src="props.src as T"
    @change="(data) => srcData = data"
    @error="(e: Error) => srcError = e"
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
          :data="srcData"
          :error="allErrors[0]"
          :refresh="props.src !== '' ? refresh : () => {}"
        >
          <!-- KAlert -->
        </slot>
      </template>
      <slot
        name="loadable"
        :data="srcData"
        :error="srcError"
        :refresh="props.src !== '' ? refresh : () => {}"
      />
      <slot
        name="default"
        :data="srcData as NonNullable<typeof srcData>"
        :error="srcError"
        :refresh="props.src !== '' ? refresh : () => {}"
      />
    </template>

    <template
      v-else-if="allErrors.length > 0"
    >
      <slot
        name="error"
        :data="srcData"
        :error="allErrors[0]"
        :refresh="props.src !== '' ? refresh : () => {}"
      >
        <ErrorBlock
          :error="allErrors[0]"
        />
      </slot>
    </template>
    <template v-else>
      <slot
        name="loadable"
        :data="srcData"
        :error="srcError"
        :refresh="props.src !== '' ? refresh : () => {}"
      />
      <slot
        v-if="props.loader && typeof slots.loadable === 'undefined'"
        name="connecting"
        :data="srcData"
        :error="srcError"
        :refresh="props.src !== '' ? refresh : () => {}"
      >
        <LoadingBlock />
      </slot>
      <slot
        v-else
        name="default"
        :data="srcData as NonNullable<typeof srcData>"
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
import { computed, ref, useSlots } from 'vue'

import type { TypeOf } from '@/app/application'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'

const props = withDefaults(defineProps<{
  data?: TypeOf<T>[]
  errors?: (Error | undefined)[]
  src?: T
  loader?: boolean
}>(), {
  errors: () => [],
  data: () => [],
  src: '' as any,
  loader: true,
})

const slots = useSlots()

const srcData = ref<TypeOf<T> | undefined>(undefined)
const srcError = ref<Error | undefined>(undefined)

const allData = computed(() => {
  if (props.src !== '') {
    return [srcData.value as TypeOf<T>].concat(props.data)
  }
  return props.data
})

const allErrors = computed(() => {
  const errors = typeof srcError.value === 'undefined' ? props.errors : ([srcError.value] as (Error | undefined)[]).concat(props.errors)
  return errors.filter(<T, >(item: T): item is NonNullable<T> => Boolean(item))
})

</script>
