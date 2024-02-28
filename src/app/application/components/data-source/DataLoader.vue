<template>
  <DataSource
    v-slot="{ refresh }"
    :src="props.src"
    @change="(data) => srcData = data"
    @error="(e) => srcError = e"
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
          :data="props.src !== '' ? allData[0] : undefined"
          :error="props.src !== '' ? allErrors[0] : undefined"
          :refresh="props.src !== '' ? refresh : () => {}"
        >
          <!-- KAlert -->
        </slot>
      </template>
      <slot
        name="default"
        :data="props.src !== '' ? allData[0] : undefined"
        :error="props.src !== '' ? allErrors[0] : undefined"
        :refresh="props.src !== '' ? refresh : () => {}"
      />
    </template>

    <template
      v-else-if="allErrors.length > 0"
    >
      <slot
        name="error"
        :data="props.src !== '' ? allData[0] : undefined"
        :error="props.src !== '' ? allErrors[0] : undefined"
        :refresh="props.src !== '' ? refresh : () => {}"
      >
        <ErrorBlock
          :error="allErrors[0]"
        />
      </slot>
    </template>
    <template v-else>
      <slot
        v-if="props.loader"
        name="connecting"
        :data="props.src !== '' ? allData[0] : undefined"
        :error="props.src !== '' ? allErrors[0] : undefined"
        :refresh="props.src !== '' ? refresh : () => {}"
      >
        <LoadingBlock />
      </slot>
      <slot
        v-else
        name="default"
        :data="props.src !== '' ? allData[0] : undefined"
        :error="props.src !== '' ? allErrors[0] : undefined"
        :refresh="props.src !== '' ? refresh : () => {}"
      />
    </template>
  </DataSource>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'

import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'

const props = withDefaults(defineProps<{
  data: any[]
  errors: (Error | undefined)[]
  src: string
  loader?: boolean
}>(), {
  errors: () => [],
  data: () => [],
  src: '',
  loader: true,
})

const srcData = ref<any>(undefined)
const srcError = ref<Error | undefined>(undefined)

const allData = computed(() => {
  if (props.src !== '') {
    return [srcData.value].concat(props.data)
  }
  return props.data
})

const allErrors = computed(() => {
  const errors = typeof srcError.value === 'undefined' ? props.errors : ([srcError.value] as (Error | undefined)[]).concat(props.errors)
  return errors.filter(<T, >(item: T): item is NonNullable<T> => Boolean(item))
})

</script>
