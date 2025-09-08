<template>
  <div
    class="x-copy-button"
  >
    <span
      v-if="props.format === 'custom' && props.text"
      class="text"
    >
      <slot
        name="default"
      >
        {{ props.text }}
      </slot>
    </span>
    <KCopy
      v-bind="attrs"
      ref="component"
      :class="{
        'hidden': props.text.length === 0,
      }"
      :aria-hidden="props.text.length === 0"
      :format="props.format === 'custom' ? 'hidden' : props.format"
      :text="props.text.length === 0 ? _text : props.text"
      :badge="props.variant === 'badge'"
    />
    <slot
      v-if="copy && props.text.length === 0"
      name="default"
      :copy="copy"
    />
  </div>
</template>
<script lang="ts" setup>
import { KCopy } from '@kong/kongponents'
import { ref, nextTick, useAttrs } from 'vue'

type KCopyT = InstanceType<typeof KCopy>
type Format = KCopyT['$props']['format']

const attrs = useAttrs()

const component = ref<KCopyT | null>(null)

const _text = ref('')
const copy = async (text: string) => {
  _text.value = text
  await nextTick()
  component.value!.copy()
}

const props = withDefaults(defineProps<{
  text?: string
  format?: Format | 'custom'
  variant?: 'badge'
}>(), {
  text: '',
  format: 'custom',
  variant: undefined,
})

</script>
<style lang="scss" scoped>
.hidden {
  display: none;
}
.x-copy-button {
  display: inline-flex;
  align-items: center;
  gap: $kui-space-40;
}

.text {
  min-width: 0;
  word-wrap: break-word;
}
</style>
