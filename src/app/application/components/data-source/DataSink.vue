<template>
  <XDisclosure
    v-slot="{ toggle, expanded }"
  >
    <DataSource
      v-if="expanded"
      :src="`${props.src}/${JSON.stringify(data)}`"
      @change="toggle"
    />
    <!-- eslint-disable vue/no-lone-template -->
    <template
      :ref="() => write = toggle"
    />
    <!-- eslint-enable -->
  </XDisclosure>
  <slot
    :submit="(args: any) => { data = args;write()}"
  />
</template>

<script lang="ts" generic="T extends string | {
  toString(): string
  typeOf(): any
}" setup
>
import { ref } from 'vue'

const props = defineProps<{
  src: T
}>()

const data = ref({})
const write = ref(() => {})
</script>
