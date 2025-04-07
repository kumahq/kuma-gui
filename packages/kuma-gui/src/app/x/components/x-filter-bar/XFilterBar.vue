<template>
  <div class="filter-bar" :style="`--width:${width}px`">
    <div class="container">
      <div class="content-wrapper">
        <div class="content"><div ref="contentRef" v-html="inputValue.replace(/([\w-\.\/]+:[\w-\.\/]+)/gi, `<span class='highlight'>$1</span>`)"></div></div>
      </div>
      <div class="wrapper">
        <div ref="sizerRef" class="sizer"><span>{{ inputValue }}</span></div>
        <form @submit.prevent="submit">  
          <XInput :value="props.defaultValue" :placeholder="props.placeholder" appearance="filter" @input="onChange" />
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

// TODO: dropdown: on submit, the dropdown should close, but the input field should stay focused. when starting to type again, the dropdown should open again/11
const props = withDefaults(defineProps<{
  placeholder?: string
  defaultValue?: string
}>(), {
  placeholder: undefined,
  defaultValue: ""
})

const inputValue = ref<string>(props.defaultValue);
const width = ref<number | undefined>();
const sizerRef = ref<null | HTMLElement>(null)
const contentRef = ref<null | HTMLElement>(null)

const emit = defineEmits<{
  (e: 'submit', value: Record<string, string> & { raw: string }): void
}>()

const onChange = (event: string) => {
  if(sizerRef.value) {
    const sizerWidth = sizerRef.value?.getBoundingClientRect().width
    const contentWidth = contentRef.value?.getBoundingClientRect().width
    width.value = contentWidth;
    // width.value = sizerWidth;
    console.log("🚀 ~ onChange ~ sizerWidth:", sizerWidth)
    console.log("🚀 ~ onChange ~ contentWidth:", contentWidth)
    // console.log(inputValue.value.split(/([a-z0-9]*:[a-z0-9]+)/gi))
  }
  inputValue.value = event
}

const submit = () => {
  const values = Object.fromEntries(inputValue.value.split(" ").map((v) => {
    const [key, value] = v.split(":")
    if(!key || !value) return []
    return [key, value]
  }).filter((v) => v.length))
  emit('submit', { raw: inputValue.value, ...values })
}

watch(() => props.defaultValue, () => {
  inputValue.value = props.defaultValue
})

</script>

<style scoped lang="scss">
* {
  box-sizing: border-box;
}

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
  align-self: stretch;
  flex: 1;
  width: 100%;
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
  // position: sticky;
  // right: 0;
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

.wrapper {
  position: relative;
  display: flex;
  width: 100%;
  flex-flow: column nowrap;
}

.sizer {
  position: absolute;
  visibility: hidden;
  height: 5px;
  font-size: $kui-font-size-30;
}

:deep(.k-input) {
  max-width: 100%;
}

:deep(.input-element-wrapper) {
  overflow-x: scroll;
  overflow-y: hidden;
  scrollbar-width: none;
  width: 100%;
  resize: none;
  position: relative;
}

:deep(.input) {
  width: var(--width, 'max-content');
  min-width: 100%;
  max-width: 100%;
  position: relative;
  display: flex;
  background: transparent;
  color: transparent;
  font-size: $kui-font-size-30;
  caret-color: $kui-color-text;
  font-family: $kui-font-family-code;
  word-spacing: var(--word-spacing);
  resize: none;
}
</style>