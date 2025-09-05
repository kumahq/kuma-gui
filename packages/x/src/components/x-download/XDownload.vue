<template>
  <slot
    :download="download"
    name="default"
  />
</template>
<script lang="ts" setup>

const props = withDefaults(defineProps<{
  revokeAfter?: number
}>(), {
  revokeAfter: 60000,
})

defineSlots<{
  default(props: {
    download: typeof download
  }): any
}>()

const emit = defineEmits<{
  (event: 'start'): void
}>()

const download = async (
  {
    url,
    name = `download_${
      new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-')
    }_${
      new Date().toLocaleString('en-US', { hour: '2-digit', hour12: false, minute: '2-digit', second: '2-digit' }).split(':').join('-')
    }`,
  }: {
    name: string
    url: string
  }) => {
  const a = document.createElement('a')
  a.download = name
  a.href = url
  setTimeout(() => { window.URL.revokeObjectURL(a.href) }, props.revokeAfter)
  await Promise.resolve()
  a.click()
  await Promise.resolve()
  emit('start')
}

</script>
