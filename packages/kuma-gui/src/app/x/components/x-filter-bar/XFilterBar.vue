<template>
  <div
    v-style="`--width:${width}px`"
    class="filter-bar"
    @click.stop="inputRef?.focus()"
  >
    <div class="icon-wrapper">
      <XIcon
        class="icon"
        name="filter"
      />
    </div>
    <div class="container">
      <div class="content-wrapper">
        <div class="content">
          <template
            v-for="(chunk, index) in inputValue.split(/([\w-\.\/]+:[\w-\.\/]+)/gi).filter(Boolean)"
            :key="chunk+index"
          >
            <span :class="{ highlight: /([\w-\.\/]+:[\w-\.\/]+)/gi.test(chunk) }">{{ chunk }}</span>
          </template>
        </div>
      </div>
      <div class="wrapper">
        <div
          ref="sizerRef"
          class="sizer"
        >
          <span>{{ inputValue }}</span>
        </div>
        <form @submit.prevent="submit">
          <input
            ref="inputRef"
            type="text"
            :defaultValue="props.defaultValue"
            :placeholder="props.placeholder"
            @input="onChange"
          >
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const props = withDefaults(defineProps<{
  placeholder?: string
  defaultValue?: string
}>(), {
  placeholder: undefined,
  defaultValue: '',
})

const inputValue = ref<string>(props.defaultValue)
const width = ref<number | undefined>()
const sizerRef = ref<null | HTMLElement>(null)
const inputRef = ref<null | HTMLInputElement>(null)

const emit = defineEmits<{
  (e: 'submit', value: Record<string, string> & { raw: string }): void
}>()

const onChange = (event: Event): void => {
  const value = (event.target as HTMLInputElement)?.value
  const sizerWidth = sizerRef.value?.getBoundingClientRect().width
  width.value = sizerWidth
  inputValue.value = value
}

const submit = () => {
  const values = Object.fromEntries(inputValue.value.split(' ').map((v) => {
    const [key, value] = v.split(':')
    if(!key || !value) return []
    return [key, value]
  }).filter((v) => v.length))
  emit('submit', { raw: inputValue.value, ...values })
}
</script>

<style scoped lang="scss">
.filter-bar {
  --word-spacing: $kui-space-40;
  position: relative;
  min-width: inherit;
  width: 0;
  display: inline-flex;
  vertical-align: middle;
  cursor: text;
  outline: none;
  align-items: center;
  font-family: $kui-font-family-code;
  font-size: $kui-font-size-30;
  word-spacing: var(--word-spacing);
  border-radius: $kui-border-radius-20;
  box-shadow: $kui-shadow-border;
  transition: box-shadow $kui-animation-duration-20 ease-in-out;
  padding: $kui-space-40 $kui-space-50 $kui-space-40 $kui-space-100;
  color: $kui-color-text;

  &:hover {
    box-shadow: $kui-shadow-border-primary-weak;
  }
  &:focus-within {
    box-shadow: $kui-shadow-border-primary, $kui-shadow-focus;
  }
}

.icon-wrapper {
  position: absolute;
  left: $kui-space-50;
  color: $kui-color-background-primary;
  height: 100%;
  display: flex;
  align-items: center;
}

:deep(.icon) {
  height: $kui-icon-size-40 !important;
  width: $kui-icon-size-40 !important;
}

.container {
  position: relative;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  align-items: center;
  scrollbar-width: none;
  flex: 1;
  align-self: stretch;
}

.content-wrapper {
  position: absolute;
  display: inline-flex;
  padding: 0;
  word-break: break-word;
  white-space: pre;
  flex: 1;
}

:deep(.highlight) {
  // TODO: there is currently no token for this color
  background: #f0f4f7;
  padding: $kui-space-10 0px;
  border-radius: $kui-border-radius-20;
  word-spacing: var(--word-spacing);
}

.wrapper {
  width: 100%;
  align-self: stretch;
}

.sizer {
  position: absolute;
  top: 0;
  left: 0;
  height: 0;
  overflow: scroll;
  white-space: pre;
  visibility: hidden;
}

input {
  width: var(--width, "max-content");
  position: relative;
  display: flex;
  min-width: 100%;
  padding: 0;
  overflow-x: auto;
  overflow-y: hidden;
  resize: none;
  color: transparent;
  background: transparent;
  border: 0;
  outline: none;
  caret-color: $kui-color-text;
  line-height: $kui-font-size-70;
}
</style>
