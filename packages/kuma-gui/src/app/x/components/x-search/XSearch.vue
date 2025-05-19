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
      <XI18n v-slot="{ t, formatList }">
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
              v-for="(chunk, index) in inputValue.split(props.searchRegex).filter(Boolean)"
              :key="chunk+index"
            >
              <span :class="{ highlight: props.searchRegex.test(chunk) }">{{ chunk }}</span>
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
      </XI18n>
    </div>
    
    <template #content>
      <XI18n v-slot="{ t }">
        <div class="dropdown-item">
          <p
            v-if="inputValue.length"
            class="filter-block"
          >
            <template
              v-for="(chunk, i) in inputValue.split(props.searchRegex).filter(Boolean)"
              :key="chunk+i"
            >
              <dl v-if="props.searchRegex.test(chunk)">
                <template
                  v-for="([key, ...values], j) in [chunk.split(':')]"
                  :key="key+j"
                >
                  <template v-if="!values.length">
                    <dt>{{ props.defaultKey }}:</dt><dd class="text-important">
                      {{ key }}
                    </dd>
                  </template>
                  <template v-else>
                    <dt>{{ key }}:</dt><dd class="text-important">
                      {{ values.join(':') }}
                    </dd>
                  </template>
                </template>
              </dl>
            </template>
            <XBadge appearance="decorative">
              {{ t("components.x-search.submit") }}
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
            <span class="text-important">
              {{ t("components.x-search.logic") }}
            </span> {{ props.keys.join(', ') }}
          </p>
        </div>
      </XI18n>
    </template>
  </KPop>
</template>

<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core'
import { ref } from 'vue'

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
  /**
   * A regular expression that highlights different values and key:value pairs.
   */
  searchRegex: RegExp
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

useResizeObserver(contentRef, ([entry]) => {
  width.value = entry?.contentRect?.width

  // keep the cursor position in the view
  containerRef.value?.scrollBy(inputRef.value?.scrollLeft ?? 0, 0)
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

    .filter-block {
      display: flex;
      gap: $kui-space-40;
      flex-flow: row wrap;
    }

    p {
      line-height: $kui-line-height-40;
    }

    dl {
      display: inline-flex;
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
