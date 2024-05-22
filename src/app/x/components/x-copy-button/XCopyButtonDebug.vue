<template>
  <CopyButton
    :text="props.text"
    @mouseup="() => {
      createCopy(() => {})(props.text)
    }"
  >
    <template
      #default="{ copy }"
    >
      <slot
        name="default"
        :copy="createCopy(copy)"
      />
    </template>
  </CopyButton>
</template>
<script lang="ts" setup>
import CopyButton from '@/app/x/components/x-copy-button/XCopyButton.vue'
const props = withDefaults(defineProps<{
  text?: ''
}>(), {
  text: '',
})
const createCopy = (copy: (text: string) => void) => (text: string) => {
  console.info(
    '%cx-copy-button-debug: The following was copied to the clipboard:', 'color: blue',
    `
${text}`,
  )
  try {
    // KCopy gives us no way to detect an error
    // so this should never throw unless there is an error with the code
    copy(text)
  } catch (e) {
    console.error(
      'x-copy-button-debug: The following wasn\'t copied to the clipboard:',
      `
  ${text}`,
    )
    console.error(e)
  }
}
</script>
