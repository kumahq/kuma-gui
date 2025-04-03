<template>
  <KPop
    ref="dropdownRef"
    class="dropdown"
    hide-close-icon
    hide-caret
    @open="() => isDropdownOpen = true"
    @close="() => isDropdownOpen = false"
  >
    <div
      v-style="`--width:${width}px`"
      class="container"
      data-testid="filter-bar"
      @click="inputRef?.focus()"
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
            :placeholder="props.placeholder ?? t('components.x-search.filterBy', { count: props.keys.length, keys: formatList(props.keys, { type: 'disjunction' }) })"
            data-testid="filter-bar-filter-input"
            :name="props.name"
            @input="onInput"
            @change="emit('change', inputValue)"
            @keyup="onKeyEvent"
          >
        </div>
      </div>
    </div>
    
    <template #content>
      <div class="dropdown-item">
        <p
          v-if="inputValue.length"
          class="filter-block"
        >
          <template
            v-for="(chunk, i) in inputValue.split(regex).filter(Boolean)"
            :key="chunk+i"
          >
            <span v-if="regex.test(chunk)">
              <template
                v-for="([key, ...values], j) in [chunk.split(':')]"
                :key="key+j"
              >
                <span v-if="!values.length">{{ props.defaultKey }}:<span class="text-important">{{ key }}</span></span>
                <span v-else>{{ key }}:</span><span class="text-important">{{ values.join(':') }}</span>
              </template>
            </span>
            <span v-else>
              {{ chunk }}
            </span>
          </template>
          <XBadge appearance="decorative">
            <XI18n
              tag="span"
              path="components.x-search.submit"
            />
            <XIcon name="submit" />
          </XBadge>
        </p>
        <XI18n
          v-else
          path="components.x-search.placeholder"
        />
      </div>
      <div
        v-if="props.keys.length"
        class="dropdown-item bg-neutral-weakest"
      >
        <p class="logic-block">
          <XI18n
            tag="span"
            class="text-important"
            path="components.x-search.logic"
          /> {{ props.keys.join(', ') }}
        </p>
      </div>
    </template>
  </KPop>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { useI18n } from '@/app/application'
const { t, formatList } = useI18n() 

const props = withDefaults(defineProps<{
  /**
   * The placeholder of the input
   */
  placeholder?: string
  /**
   * A previous filter query as defaultValue
   */
  value?: string
  /**
   * Name of the field used in forms
   */
  name?: string
  /**
   * Provides info about filterable keys
   */
  keys?: string[]
  /**
   * The default key, that is being used to filter for when there is no `key:value` pair but only a `value`
   */
  defaultKey?: string
}>(), {
  placeholder: undefined,
  name: undefined,
  value: '',
  keys: () => [],
  defaultKey: 'name',
})

const emit = defineEmits<{
  (e: 'change', value: string): void
}>()

const regex = /([^\s]+)/
const inputValue = ref<string>(props.value)
const width = ref<number | undefined>()
const containerRef = ref<null | HTMLElement>(null)
const contentRef = ref<null | HTMLElement>(null)
const inputRef = ref<null | HTMLInputElement>(null)
const dropdownRef = ref<null | HTMLInputElement>(null)
const isDropdownOpen = ref<boolean>(false)

const onKeyEvent = ({ key }: KeyboardEvent) => {
  switch(key) {
    case 'Enter':
    case 'Escape':
      return isDropdownOpen.value && dropdownRef.value?.hidePopover()
    default:
      return !isDropdownOpen.value && dropdownRef.value?.showPopover()
  }
}

const onInput = (event: Event): void => {
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
  width: 100%;
  position: relative;
  font-family: $kui-font-family-code;
  position: relative;
  display: inline-flex;
  vertical-align: middle;
  cursor: text;
  outline: none;
  align-items: center;
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
}

.dropdown {
  position: relative;
  min-width: inherit;
  width: 0;
}


:deep(.popover) {
  position: absolute !important;
  top: 100% !important;
  left: 0;
  width: 100%;

  .popover-container {
    width: 100% !important;
    margin-top: unset !important;
    padding: 0;
    overflow: hidden;
  }

  .dropdown-item {
    color: $kui-color-text-neutral;
    font-family: $kui-font-family-code;
    padding: $kui-space-50 $kui-space-60;
    font-size: $kui-font-size-30;

    &:not(:first-child) {
      border-top: $kui-border-width-10 solid $kui-color-border;
    }

    p {
      line-height: $kui-line-height-40;
    }
  }

  .bg-neutral-weakest {
    background-color: $kui-color-background-neutral-weakest;
  }

  .text-important {
    color: $kui-color-text;
  }
}

:deep(.k-badge) {
  font-family: $kui-font-family-code;
}
</style>
