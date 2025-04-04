<template>
  <div class="filter-bar" :style="`--width:${width}px`">
    <div class="container">
      <div class="content-wrapper">
        <div class="content"><div ref="contentRef" v-html="inputValue.replace(/([a-z0-9]*:[a-z0-9]+)/gi, `<span class='highlight'>$1</span>`)"></div></div>
      </div>
      <div class="wrapper">
        <div ref="sizerRef" class="sizer"><span>{{ inputValue }}</span><span></span></div>
        <XInput :placeholder="props.placeholder" appearance="filter" @input="onChange" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const inputValue = ref<string>("");
const width = ref<number | undefined>();
const sizerRef = ref<null | HTMLElement>(null)
const contentRef = ref<null | HTMLElement>(null)

const emit = defineEmits<{
  (e: 'change', value: Record<string, string> & { raw: string }): void
}>()

const onChange = (event: string) => {
  if(sizerRef.value) {
    const sizerWidth = sizerRef.value?.getBoundingClientRect().width
    const contentWidth = contentRef.value?.getBoundingClientRect().width
    width.value = contentWidth;
    // width.value = sizerWidth;
    console.log("🚀 ~ onChange ~ sizerWidth:", sizerWidth)
    console.log("🚀 ~ onChange ~ contentWidth:", contentWidth)
  }
  inputValue.value = event

  const values = Object.fromEntries(event.split(" ").map((v) => {
    const [key,value] = v.split(":")
    if(!key || !value) return []
    return [key, value]
  }).filter((v) => v.length))
  emit('change', { raw: inputValue.value, ...values })
}

const props = withDefaults(defineProps<{
  placeholder?: string
}>(), {
  placeholder: undefined
})

</script>

<style scoped lang="scss">
.filter-bar {
  --word-spacing: $kui-space-40;

  display: flex;
  width: 100%;
  font-family: $kui-font-family-code;
  word-spacing: var(--word-spacing);
}

:deep(.highlight) {
  // TODO: there is currently no token for this color
  background: #f0f4f7;
  padding: $kui-space-10 0px;
  border-radius: $kui-border-radius-20;
  word-spacing: var(--word-spacing);
}

.container {
  position: relative;
  display: flex;
  width: 100%;
  flex-flow: column nowrap;
  flex-basis: 0%;
  flex-grow: 1;
  flex-shrink: 1;
}

.wrapper {
  position: relative;
  display: flex;
  width: 100%;
  flex-flow: column nowrap;
}

.sizer {
  position: absolute;
  visibility: hidden;
  height: 0;
  font-size: $kui-font-size-30;
}

.content-wrapper {
  position: absolute;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  left: $kui-space-100;
  right: $kui-space-50;
  overflow: hidden;
  height: 100%;
}

.content {
  font-size: $kui-font-size-30;
  position: sticky;
  right: 0;
  // flex-basis: 0%;
  // flex-grow: 1;
  // flex-shrink: 1;
  overflow-wrap: break-word;
  position: absolute;
  text-wrap-mode: nowrap;
  unicode-bidi: isolate;
  user-select: none;
  white-space-collapse: preserve;
  word-break: break-word;
  min-width: 100%;
  color: $kui-color-text;
}

:deep(.input) {
  width: var(--width, 'max-content');
  min-width: 100%;
  max-width: 100%;
  background: transparent;
  color: transparent;
  font-size: $kui-font-size-30;
  caret-color: $kui-color-text;
  font-family: $kui-font-family-code;
  word-spacing: var(--word-spacing);
}
</style>