<template>
  <form
    @submit.prevent="() => emit('submit')"
  >
    <KPrompt
      ref="$ref"
      :action-button-text="props.action"
      :confirmation-text="props.expected.length > 0 ? props.expected : undefined"
      :visible="true"
      :type="props.type"
      @cancel="() => emit('cancel')"
    >
      <template
        #title
      >
        <slot name="title" />
      </template>

      <slot name="default" />
    </KPrompt>
  </form>
</template>
<script lang="ts" setup>
import { onMounted, ref, provide } from 'vue'
const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'submit'): void
}>()
const props = withDefaults(defineProps<{
  type?: 'danger'
  expected?: string
  action: string
}>(), {
  type: 'danger',
  expected: '',
})
provide('x-prompt', {})
const $ref = ref<{$el: HTMLDivElement } | null>(null)
const rewrite = () => {
  const $el = $ref.value!.$el // $ref is statically always there

  const $confirm = $el.querySelector('button[disabled]')
  if ($confirm) {
    $confirm.setAttribute('type', 'submit')
  }
}
onMounted(rewrite)
</script>
<style lang="scss">
.error {
  margin-top: $kui-space-60;
}
</style>
