<template>
  <div
    ref="filterBar"
    class="filter-bar"
    data-testid="filter-bar"
  >
    <search>
      <form
        @submit.prevent="change"
      >
        <button
          class="focus-filter-input-button"
          title="Focus filter"
          type="button"
          data-testid="filter-bar-focus-filter-input-button"
          @click="focusFilterInput"
        >
          <span class="visually-hidden">Focus filter</span>

          <span class="filter-bar-icon">
            <FilterIcon
              decorative
              data-testid="filter-bar-filter-icon"
              hide-title
              :size="KUI_ICON_SIZE_30"
            />
          </span>
        </button>

        <label
          :for="`${props.id}-filter-bar-input`"
          class="visually-hidden"
        >
          <slot>
            {{ placeholderAndLabelFallback }}
          </slot>
        </label>

        <input
          :id="`${props.id}-filter-bar-input`"
          ref="filterInput"
          v-model="currentQuery"
          class="filter-bar-input"
          type="search"
          :placeholder="currentPlaceholder"
          data-testid="filter-bar-filter-input"
          name="s"
          @focus="isShowingSuggestionBox = true"
          @input="isShowingSuggestionBox = true"
          @blur="closeSuggestionBoxIfCondition"
          @search="(e: InputEvent) => {
            const $el = e.target as HTMLInputElement
            if($el.value.length === 0) {
              isShowingSuggestionBox = true
            }
          }"
        >

        <div
          v-if="isShowingSuggestionBox"
          class="suggestion-box"
          data-testid="filter-bar-suggestion-box"
        >
          <div class="suggestion-list">
            <p
              v-if="tokenizerError !== null"
              class="filter-bar-error"
            >
              {{ tokenizerError.message }}
            </p>

            <button
              v-else
              type="submit"
              class="submit-query-button"
              :class="{ 'submit-query-button-is-selected': selectedSuggestionItemIndex === 0 }"
              data-testid="filter-bar-submit-query-button"
            >
              Submit {{ currentQuery }}
            </button>

            <div
              v-for="(fieldEntry, index) in fieldEntries"
              :key="`${props.id}-${index}`"
              class="suggestion-list-item"
              :class="{ 'suggestion-list-item-is-selected': selectedSuggestionItemIndex === index + 1 }"
            >
              <b>{{ fieldEntry.fieldName }}</b><span v-if="fieldEntry.description !== ''">: {{ fieldEntry.description }}</span>

              <button
                class="apply-suggestion-button"
                :title="`Add ${fieldEntry.fieldName}:`"
                type="button"
                :data-filter-field="fieldEntry.fieldName"
                data-testid="filter-bar-apply-suggestion-button"
                @click="applySuggestion"
              >
                <span class="visually-hidden">Add {{ fieldEntry.fieldName }}:</span>

                <ChevronRightIcon
                  decorative
                  hide-title
                  :size="KUI_ICON_SIZE_30"
                />
              </button>
            </div>
          </div>
        </div>
      </form>
    </search>
  </div>
</template>

<script lang="ts" setup>
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { ChevronRightIcon, FilterIcon } from '@kong/icons'
import { computed, onBeforeUnmount, onMounted, PropType, ref } from 'vue'

import { Command, ShortcutManager } from './ShortcutManager'
import uniqueId from '@/utilities/uniqueId'

export type Fields = [string, string][]

export type FilterFieldDefinition = {
  description: string
}

export type FilterFields = Record<string, FilterFieldDefinition>

const props = defineProps({
  id: {
    type: String,
    required: false,
    default: () => uniqueId('k-filter-bar'),
  },
  fields: {
    type: Object as PropType<FilterFields>,
    required: true,
  },
  placeholder: {
    type: String,
    required: false,
    default: null,
  },
  query: {
    type: String,
    required: false,
    default: '',
  },
})

const emit = defineEmits<{
  (event: 'change', data: FormData): void
}>()

const filterBar = ref<HTMLElement | null>(null)
const filterInput = ref<HTMLInputElement | null>(null)
const currentQuery = ref(props.query)
const tokenizerError = ref<Error | null>(null)
const isShowingSuggestionBox = ref(false)
/**
 * Keeps track of the selected suggestion item (from 0 to N-1 where N is the
 * number of suggestion items shown). A special value is -1 which represents
 * the “Submit” item for submitting a query. This is definitely slightly in the
 * realm of “clever code”, but it’s just very convenient to cycle between
 * highlighted items by tracking it with one index variable.
 */
const selectedSuggestionItemIndex = ref(0)

const allowedFields = computed(() => Object.keys(props.fields))

const fieldEntries = computed(() => {
  return Object.entries(props.fields)
    .slice(0, 5)
    .map(([fieldName, definition]) => ({ fieldName, ...definition }))
})

const placeholderAndLabelFallback = computed(() => {
  if (allowedFields.value.length > 0) {
    return `Filter by ${allowedFields.value.join(', ')}`
  } else {
    return 'Filter'
  }
})

const currentPlaceholder = computed(() => props.placeholder ?? placeholderAndLabelFallback.value)

type CommandKeywords = 'jumpToNextSuggestion' | 'jumpToPreviousSuggestion'

const keyMap: Record<string, CommandKeywords> = {
  ArrowDown: 'jumpToNextSuggestion',
  ArrowUp: 'jumpToPreviousSuggestion',
}
const commands: Record<CommandKeywords, Command> = {
  jumpToNextSuggestion: {
    trigger: () => jumpToSuggestion(1),
    isAllowedContext(event: Event) {
      return filterInput.value !== null && event.composedPath().includes(filterInput.value)
    },
    shouldPreventDefaultAction: true,
  },

  jumpToPreviousSuggestion: {
    trigger: () => jumpToSuggestion(-1),
    isAllowedContext(event: Event) {
      return filterInput.value !== null && event.composedPath().includes(filterInput.value)
    },
    shouldPreventDefaultAction: true,
  },
}

const shortcutManager = new ShortcutManager(keyMap, commands)

onMounted(function () {
  shortcutManager.registerListener()
})

onBeforeUnmount(function () {
  shortcutManager.unRegisterListener()
})

function change(ev: Event): void {
  if (ev?.target) {
    emit('change', new FormData(ev.target as HTMLFormElement))
    isShowingSuggestionBox.value = false
  }
}

function jumpToSuggestion(direction: number): void {
  const len = fieldEntries.value.length
  let num = selectedSuggestionItemIndex.value + direction
  if (num === -1) {
    num = len
  }
  selectedSuggestionItemIndex.value = num % (len + 1)
}

function focusFilterInput(): void {
  if (filterInput.value instanceof HTMLInputElement) {
    filterInput.value.focus()
  }
}

function applySuggestion(event: Event): void {
  const button = event.currentTarget as HTMLButtonElement
  const fieldName = button.getAttribute('data-filter-field')

  if (fieldName && filterInput.value instanceof HTMLInputElement) {
    appendFieldSuggestionToFilterInput(filterInput.value, fieldName)
  }
}

function appendFieldSuggestionToFilterInput(input: HTMLInputElement, fieldName: string) {
  const delimitingSpace = currentQuery.value === '' || currentQuery.value.endsWith(' ') ? '' : ' '
  currentQuery.value += delimitingSpace + fieldName + ':'
  input.focus()
  selectedSuggestionItemIndex.value = 0
}

function closeSuggestionBoxIfCondition(event: FocusEvent): void {
  if (event.relatedTarget === null) {
    isShowingSuggestionBox.value = false
  }

  if (filterBar.value instanceof HTMLElement && event.relatedTarget instanceof Node) {
    const isFocusTargetPartOfFilterBar = !filterBar.value.contains(event.relatedTarget)

    if (isFocusTargetPartOfFilterBar) {
      isShowingSuggestionBox.value = false
    }
  }
}

</script>

<style lang="scss" scoped>
.filter-bar-input:focus {
  // Focus styles are managed by `.filter-bar`
  outline: none;
}
.filter-bar {
  position: relative;
  background-color: $kui-color-background;
  border: $kui-border-width-10 solid $kui-color-border;
  border-radius: 3px;
  transition: border 0.1s ease;
}
input[type="search"]::-webkit-search-cancel-button {
  -webkit-appearance: none;

  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-position: center;

  display: inline-flex;
  background-color: #afb7c5;

  --kong-clear-icon: url('data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.4 17L12 13.4L15.6 17L17 15.6L13.4 12L17 8.4L15.6 7L12 10.6L8.4 7L7 8.4L10.6 12L7 15.6L8.4 17ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22Z" fill="black"/></svg>');
  -webkit-mask-image: var(--kong-clear-icon);
  mask-image: var(--kong-clear-icon);
  width: 16px;
  height: 16px;
}

.filter-bar:focus-within {
  border-color: $kui-color-border-primary-weak;
}
.filter-bar form {
  display: inline-flex;
  align-items: stretch;
  width: 100%;
}

.focus-filter-input-button {
  display: inline-flex;
  align-items: center;
}

.filter-bar-icon {
  display: inline-flex;
  align-items: center;
  padding: 0 $kui-space-40;
}

.filter-bar-input {
  flex-grow: 1;
  width: 100%;
  border: none;
}

.suggestion-box {
  position: absolute;
  top: calc(100% + 4px);
  right: -1px;
  left: -1px;
  z-index: 1;
  padding: $kui-space-20;
  background-color: $kui-color-background;
  border: $kui-border-width-10 solid $kui-color-border;
  border-radius: 3px;
}

.filter-bar-error {
  padding: $kui-space-20 $kui-space-40;
  color: $kui-color-text-danger;
}

.submit-query-button {
  align-self: stretch;
  text-align: left;
  padding: $kui-space-20 $kui-space-40;
  border-radius: 3px;
}

.filter-bar-error:not(:last-child),
.submit-query-button:not(:last-child) {
  margin-bottom: $kui-space-20;
  border-bottom: $kui-border-width-10 solid $kui-color-border;
  padding-bottom: $kui-space-20;
}

.suggestion-list {
  display: flex;
  flex-direction: column;
  gap: $kui-space-20;
}

.suggestion-list-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: $kui-space-20 0 $kui-space-20 $kui-space-40;
}

.submit-query-button-is-selected,
.suggestion-list-item-is-selected {
  color: $kui-color-text-inverse;
  background-color: $kui-color-background-primary;
  border-radius: 3px;
}

.apply-suggestion-button {
  align-self: stretch;
  display: inline-flex;
  align-items: center;
  margin-left: auto;
  padding-right: $kui-space-20;
  padding-left: $kui-space-20;
  border-radius: 3px;
  color: $kui-color-text-neutral-weak;
}

.apply-suggestion-button:hover,
.apply-suggestion-button:focus {
  color: $kui-color-text-inverse;
  background-color: $kui-color-background-primary;
}

.apply-suggestion-button::before {
  content: '';
  position: absolute;
  z-index: 2;
  inset: 0;
}

.clear-query-button {
  display: inline-flex;
  align-items: center;
  padding: 0 $kui-space-40;
  margin: 0;
  font: inherit;
  color: $kui-color-text-neutral-weak;
  background-color: transparent;
  border: $kui-border-width-10 solid transparent;
  border-radius: 3px;
  appearance: none;
}

.clear-query-button:focus {
  border-color: $kui-color-border-primary;
  outline: none;
  box-shadow: 0 0 0 2px #fff, 0 0 0 4px $kui-color-border-primary;
}
</style>
