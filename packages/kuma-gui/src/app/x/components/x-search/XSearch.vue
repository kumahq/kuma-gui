<template>
  <div
    v-style="`--width:${width}px`"
    class="container"
    data-testid="filter-bar"
    @click.stop="inputRef?.focus()"
  >
    <div class="icon-wrapper">
      <XIcon
        class="icon"
        name="search"
      />
    </div>
    <div
      ref="containerRef"
      class="input-container"
    >
      <div
        ref="contentRef"
        class="content-wrapper"
      >
        <template
          v-for="(chunk, index) in inputValue.split(regex).filter(Boolean)"
          :key="chunk+index"
        >
          <span :class="{ highlight: regex.test(chunk) }">{{ chunk }}</span>
        </template>
      </div>
      <div class="input-wrapper">
        <input
          ref="inputRef"
          type="text"
          :defaultValue="props.value"
          :placeholder="props.placeholder"
          data-testid="filter-bar-filter-input"
          :name="props.name"
          @input="onChange"
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  placeholder?: string
  value?: string
  name?: string
}>(), {
  placeholder: undefined,
  name: undefined,
  value: '',
})

const regex = /([^\s])/i
const inputValue = ref<string>(props.value)
const width = ref<number | undefined>()
const containerRef = ref<null | HTMLElement>(null)
const contentRef = ref<null | HTMLElement>(null)
const inputRef = ref<null | HTMLInputElement>(null)

const onChange = (event: Event): void => {
  const value = (event.target as HTMLInputElement)?.value
  inputValue.value = value
}

onMounted(() => {
  const observer = new ResizeObserver(([e]) => {
    width.value = e?.contentRect?.width

    // keep the cursor position in the view
    containerRef.value?.scrollBy(inputRef.value?.scrollLeft ?? 0, 0)
  })
  observer.observe(contentRef.value as HTMLElement)
})
</script>

<style scoped lang="scss">
.container {
  min-width: inherit;
  width: 0;
  position: relative;
  display: inline-flex;
  vertical-align: middle;
  cursor: text;
  outline: none;
  align-items: center;
  font-family: $kui-font-family-code;
  font-size: $kui-font-size-30;
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

.input-container {
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

  span {
    padding: $kui-space-10 0px;

    &.highlight {
      background: #f0f4f7;
      border-radius: $kui-border-radius-20;
    }
  }
}

.input-wrapper {
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
  direction: ltr;
}
</style>
