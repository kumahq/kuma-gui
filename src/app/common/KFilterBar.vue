<template>
  <div
    ref="filterBar"
    class="k-filter-bar"
    data-testid="k-filter-bar"
  >
    <button
      class="k-focus-filter-input-button"
      title="Focus filter"
      type="button"
      data-testid="k-filter-bar-focus-filter-input-button"
      @click="focusFilterInput"
    >
      <span class="visually-hidden">Focus filter</span>

      <KIcon
        aria-hidden="true"
        class="k-filter-icon"
        color="var(--grey-400)"
        data-testid="k-filter-bar-filter-icon"
        hide-title
        icon="filter"
        size="20"
      />
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
      v-model="query"
      class="k-filter-bar-input"
      type="text"
      :placeholder="placeholder"
      data-testid="k-filter-bar-filter-input"
      @focus="isShowingSuggestionBox = true"
      @blur="closeSuggestionBoxIfCondition"
      @change="handleQueryChangeEvent"
    >

    <div
      v-if="isShowingSuggestionBox"
      class="k-suggestion-box"
      data-testid="k-filter-bar-suggestion-box"
    >
      <div class="k-suggestion-list">
        <p
          v-if="tokenizerError !== null"
          class="k-filter-bar-error"
        >
          {{ tokenizerError.message }}
        </p>

        <button
          v-else
          class="k-submit-query-button"
          :class="{ 'k-submit-query-button-is-selected': selectedSuggestionItemIndex === -1 }"
          title="Submit query"
          type="button"
          data-testid="k-filter-bar-submit-query-button"
          @click="submitQuery"
        >
          Submit {{ query }}
        </button>

        <div
          v-for="(fieldEntry, index) in fieldEntries"
          :key="`${props.id}-${index}`"
          class="k-suggestion-list-item"
          :class="{ 'k-suggestion-list-item-is-selected': selectedSuggestionItemIndex === index }"
        >
          <b>{{ fieldEntry.fieldName }}</b><span v-if="fieldEntry.description !== ''">: {{ fieldEntry.description }}</span>

          <button
            class="k-apply-suggestion-button"
            :title="`Add ${fieldEntry.fieldName}:`"
            type="button"
            :data-filter-field="fieldEntry.fieldName"
            data-testid="k-filter-bar-apply-suggestion-button"
            @click="applySuggestion"
          >
            <span class="visually-hidden">Add {{ fieldEntry.fieldName }}:</span>

            <KIcon
              aria-hidden="true"
              color="currentColor"
              hide-title
              icon="chevronRight"
              size="16"
            />
          </button>
        </div>
      </div>
    </div>

    <button
      v-if="query !== ''"
      class="k-clear-query-button"
      title="Clear query"
      type="button"
      data-testid="k-filter-bar-clear-query-button"
      @click="clearQuery"
    >
      <span class="visually-hidden">Clear query</span>

      <KIcon
        aria-hidden="true"
        color="currentColor"
        icon="clear"
        hide-title
        size="20"
      />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { KIcon } from '@kong/kongponents'
import { computed, onBeforeUnmount, onMounted, PropType, ref, watch } from 'vue'

import { clamp } from '@/utilities/clamp'
import { Command, ShortcutManager } from '@/utilities/ShortcutManager'
import { tokenizeFieldFilterQuery } from '@/utilities/tokenizeFieldFilterQuery'

export type Fields = [string, string][]

export type FilterBarEventData = {
  query: string
  fields: Fields
}

export type FilterFieldDefinition = {
  description: string
}

export type FilterFields = Record<string, FilterFieldDefinition>

const props = defineProps({
  /**
   * ID value used for form elements like the search input and its label.
   */
  id: {
    type: String,
    required: true,
  },

  /**
   * The fields that can be used with the filter bar. Providing an unknown field name will display an error.
   */
  fields: {
    type: Object as PropType<FilterFields>,
    required: true,
  },

  /**
   * The filter input’s placeholder attribute value.
   */
  placeholder: {
    type: String,
    required: false,
    default: null,
  },

  /**
   * Used as the initial value of the filter input. Can be used to initialize a filter bar with a query which was read from client storage. **Default: `''`**.
   */
  query: {
    type: String,
    required: false,
    default: '',
  },
})

const emit = defineEmits<{
  /**
   * Fired when the fields change. Not fired again for inconsequential changes to the query (i.e. changes that would semantically produce the same set of entered fields emitted by the event).
   */
  (event: 'fields-change', data: FilterBarEventData): void
}>()

const filterBar = ref<HTMLElement | null>(null)
const filterInput = ref<HTMLInputElement | null>(null)
const query = ref(props.query)
const fields = ref<Fields>([])
const tokenizerError = ref<Error | null>(null)
const isShowingSuggestionBox = ref(false)
/**
 * Keeps track of the selected suggestion item (from 0 to N-1 where N is the number of suggestion items shown). A special value is -1 which represents the “Submit” item for submitting a query. This is definitely slightly in the realm of “clever code”, but it’s just very convenient to cycle between highlighted items by tracking it with one index variable.
 */
const selectedSuggestionItemIndex = ref(-1)

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

const placeholder = computed(() => props.placeholder ?? placeholderAndLabelFallback.value)

watch(() => fields.value, function (newFields, oldFields) {
  // Only emits the event if the fields have changed.
  if (!areFieldsSemanticallyIdentical(newFields, oldFields)) {
    tokenizerError.value = null

    emit('fields-change', { fields: newFields, query: query.value })
  }
})

watch(() => query.value, function () {
  if (query.value === '') {
    tokenizerError.value = null
  }

  isShowingSuggestionBox.value = true
})

type CommandKeywords = 'submitQuery' | 'jumpToNextSuggestion' | 'jumpToPreviousSuggestion' | 'closeSuggestionBox'

/**
 * Maps shortcuts to their associated command keywords.
 */
const keyMap: Record<string, CommandKeywords> = {
  Enter: 'submitQuery',
  Escape: 'closeSuggestionBox',
  ArrowDown: 'jumpToNextSuggestion',
  ArrowUp: 'jumpToPreviousSuggestion',
}

/**
 * Maps command keywords to their associated commands.
 */
const commands: Record<CommandKeywords, Command> = {
  submitQuery: {
    trigger: submitQuery,
    isAllowedContext(event: Event) {
      return filterInput.value !== null && event.composedPath().includes(filterInput.value)
    },
    shouldPreventDefaultAction: true,
  },

  jumpToNextSuggestion: {
    trigger: jumpToNextSuggestion,
    isAllowedContext(event: Event) {
      return filterInput.value !== null && event.composedPath().includes(filterInput.value)
    },
    shouldPreventDefaultAction: true,
  },

  jumpToPreviousSuggestion: {
    trigger: jumpToPreviousSuggestion,
    isAllowedContext(event: Event) {
      return filterInput.value !== null && event.composedPath().includes(filterInput.value)
    },
    shouldPreventDefaultAction: true,
  },

  closeSuggestionBox: {
    trigger: closeSuggestionBox,
    isAllowedContext(event: Event) {
      return filterBar.value !== null && event.composedPath().includes(filterBar.value)
    },
  },
}

function start() {
  const shortcutManager = new ShortcutManager(keyMap, commands)

  onMounted(function () {
    shortcutManager.registerListener()
  })

  onBeforeUnmount(function () {
    shortcutManager.unRegisterListener()
  })

  recomputeFields(query.value)
}

start()

function handleQueryChangeEvent(event: Event): void {
  const input = event.target as HTMLInputElement
  recomputeFields(input.value)
}

function submitQuery(): void {
  if (!(filterInput.value instanceof HTMLInputElement)) {
    return
  }

  if (selectedSuggestionItemIndex.value === -1) {
    recomputeFields(filterInput.value.value)
    isShowingSuggestionBox.value = false
  } else {
    const fieldName = fieldEntries.value[selectedSuggestionItemIndex.value].fieldName

    if (fieldName) {
      appendFieldSuggestionToFilterInput(filterInput.value, fieldName)
    }
  }
}

function jumpToNextSuggestion(): void {
  jumpToSuggestion(1)
}

function jumpToPreviousSuggestion(): void {
  jumpToSuggestion(-1)
}

function jumpToSuggestion(direction: number): void {
  selectedSuggestionItemIndex.value = clamp(selectedSuggestionItemIndex.value + direction, -1, fieldEntries.value.length - 1)
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
  const delimitingSpace = query.value === '' || query.value.endsWith(' ') ? '' : ' '
  query.value += delimitingSpace + fieldName + ':'
  input.focus()
  selectedSuggestionItemIndex.value = -1
}

function clearQuery(): void {
  query.value = ''

  if (filterInput.value instanceof HTMLInputElement) {
    filterInput.value.value = ''
    filterInput.value.focus()
    recomputeFields('')
  }
}

function closeSuggestionBoxIfCondition(event: FocusEvent): void {
  if (event.relatedTarget === null) {
    closeSuggestionBox()
  }

  if (filterBar.value instanceof HTMLElement && event.relatedTarget instanceof Node) {
    const isFocusTargetPartOfFilterBar = !filterBar.value.contains(event.relatedTarget)

    if (isFocusTargetPartOfFilterBar) {
      closeSuggestionBox()
    }
  }
}

function closeSuggestionBox(): void {
  isShowingSuggestionBox.value = false
}

/**
 * Recomputes the `fields` state based on `query`.
 */
function recomputeFields(query: string): void {
  tokenizerError.value = null

  try {
    const newFields = tokenizeFieldFilterQuery(query, allowedFields.value)

    // Sorts fields by their names to ensure that semantically identical sets of fields can be identified (e.g. to avoid emitting redundant events).
    // For example, the fields `[['a', 'a'], ['b', 'b']]` and `[['b', 'b'], ['a', 'a']]` should be considered semantically identical.
    newFields.sort((newFieldsA, newFieldsB) => newFieldsA[0].localeCompare(newFieldsB[0]))

    fields.value = newFields
  } catch (error) {
    if (error instanceof Error) {
      tokenizerError.value = error
      isShowingSuggestionBox.value = true
    } else {
      throw error
    }
  }
}

/**
 * @returns whether two sets of fields are semantically identical.
 */
function areFieldsSemanticallyIdentical(fieldsA: Fields, fieldB: Fields): boolean {
  return JSON.stringify(fieldsA) === JSON.stringify(fieldB)
}
</script>

<style lang="scss" scoped>
.k-filter-bar {
  position: relative;
  max-width: 700px;
  display: inline-flex;
  align-items: stretch;
  background-color: var(--white);
  border: 1px solid var(--grey-300);
  border-radius: 3px;
  transition: border 0.1s ease;
}

.k-filter-bar:focus-within {
  border-color: var(--blue-400);
}

.k-focus-filter-input-button {
  display: inline-flex;
  align-items: center;
}

.k-filter-icon {
  display: inline-flex;
  align-items: center;
  padding: 0 var(--spacing-xs);
}

.k-filter-bar-input {
  flex-grow: 1;
  width: 100%;
  border: none;
}

.k-filter-bar-input:focus {
  // Focus styles are managed by `.filter-bar`
  outline: none;
}

.k-suggestion-box {
  position: absolute;
  top: calc(100% + var(--spacing-xxs));
  right: -1px;
  left: -1px;
  z-index: 1;
  padding: var(--spacing-xxs);
  background-color: var(--white);
  border: 1px solid var(--grey-400);
  border-radius: 3px;
}

.k-filter-bar-error {
  padding: var(--spacing-xxs) var(--spacing-xs);
  color: var(--red-700);
}

.k-submit-query-button {
  align-self: stretch;
  text-align: left;
  padding: var(--spacing-xxs) var(--spacing-xs);
  border-radius: 3px;
}

.k-filter-bar-error:not(:last-child),
.k-submit-query-button:not(:last-child) {
  margin-bottom: var(--spacing-xxs);
  border-bottom: 1px solid var(--grey-300);
  padding-bottom: var(--spacing-xxs);
}

.k-suggestion-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xxs);
}

.k-suggestion-list-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: var(--spacing-xxs) 0 var(--spacing-xxs) var(--spacing-xs);
}

.k-submit-query-button-is-selected,
.k-suggestion-list-item-is-selected {
  color: var(--white);
  background-color: var(--blue-500);
  border-radius: 3px;
}

.k-apply-suggestion-button {
  align-self: stretch;
  display: inline-flex;
  align-items: center;
  margin-left: auto;
  padding-right: var(--spacing-xxs);
  padding-left: var(--spacing-xxs);
  border-radius: 3px;
  color: var(--grey-400);
}

.k-apply-suggestion-button:hover,
.k-apply-suggestion-button:focus {
  color: var(--white);
  background-color: var(--blue-500);
}

.k-apply-suggestion-button::before {
  content: '';
  position: absolute;
  z-index: 2;
  inset: 0;
}

.k-clear-query-button {
  display: inline-flex;
  align-items: center;
  padding: 0 var(--spacing-xs);
  margin: 0;
  font: inherit;
  color: var(--grey-400);
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: 3px;
  appearance: none;
}

.k-clear-query-button:focus {
  border-color: var(--blue-500);
  outline: none;
  box-shadow: 0 0 0 2px var(--white), 0 0 0 4px var(--blue-500);
}
</style>
