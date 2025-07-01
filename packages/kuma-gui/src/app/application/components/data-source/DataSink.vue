<template>
  <XDisclosure
    v-slot="{ toggle, expanded }"
  >
    <DataSource
      v-if="expanded"
      :src="`${props.src}/${encodeURIComponent(JSON.stringify(payload))}?cacheControl=no-cache&retry=none`"
      @change="(d: TypeOf<T>) => {
        writing = false
        data = d;
        error = undefined;
        emit('change', d)
        toggle()
      }"
      @error="(e: Error) => {
        writing = false
        error = e;
        emit('error', e)
        toggle()
      }"
    />
    <!-- eslint-disable vue/no-lone-template -->
    <template
      :ref="() => {
        write = toggle
      }"
    />
    <!-- eslint-enable -->
  </XDisclosure>
  <slot
    :submit="submit"
    :error="error"
    :writing="writing"
    :data="data"
    :payload="payload"
  />
</template>

<script lang="ts" generic="T extends string | {
  toString(): string
  typeOf(): any
}" setup
>
import { ref } from 'vue'

import type { TypeOf } from '@/app/application'

const emit = defineEmits<{
  (e: 'change', value: TypeOf<T>): void
  (e: 'error', error: Error): void
}>()
const props = defineProps<{
  src: T
}>()

const payload = ref<any>()
const data = ref<TypeOf<T> | undefined>()
const error = ref<Error | undefined>()
const writing = ref<boolean>(false)
const write = ref(() => {})
const submit = (args: any) => {
  payload.value = args
  writing.value = true
  write.value()
}

</script>
