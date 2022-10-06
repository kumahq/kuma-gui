<template>
  <div
    ref="codeBlock"
    class="code-block"
    tabindex="0"
  >
    <div
      v-if="isSearchable"
      class="code-block__actions"
    >
      <KIcon
        v-if="isProcessing"
        icon="spinner"
        data-testid="search-is-processing-icon"
      />

      <p
        v-if="regExpError !== null"
        class="code-search-error"
      >
        {{ regExpError.message }}
      </p>

      <p v-else-if="!isProcessing && query !== ''">
        <template v-if="!isShowingFilteredCode && matchingLineNumbers.length > 0 && typeof currentLineIndex === 'number'">
          {{ currentLineIndex + 1 }} of
        </template>

        {{ matchingLineNumbers.length }} results
      </p>

      <KLabel
        :for="`${id}-search-input`"
        class="code-search"
      >
        <span class="kutil-sr-only">Highlight</span>

        <KInput
          :id="`${id}-search-input`"
          data-testid="search-input"
          type="text"
          :model-value="query"
          @input="handleSearch"
        />
      </KLabel>

      <KButton
        class="regexp-mode-button"
        type="button"
        :appearance="regExpButtonAppearance"
        :aria-pressed="isRegExpMode"
        :is-rounded="false"
        size="small"
        title="Use regular expression (Alt+R)"
        data-testid="regexp-mode-button"
        @click="toggleRegExpMode"
      >
        <span class="kutil-sr-only">RegExp mode enabled</span>

        .*
      </KButton>

      <KButton
        class="filter-mode-button"
        type="button"
        icon="filter"
        :appearance="isFilterMode ? 'secondary' : 'outline'"
        :aria-pressed="isFilterMode"
        :is-rounded="false"
        size="small"
        title="Filter results (Alt+F)"
        data-testid="filter-mode-button"
        @click="toggleFilterMode"
      >
        <template #icon>
          <KIcon
            class="button-icon"
            icon="filter"
            size="16"
            title="Filter results (Alt+F)"
            color="currentColor"
          />
        </template>

        <span class="kutil-sr-only">Filter mode enabled</span>
      </KButton>

      <KButton
        class="previous-match-button"
        type="button"
        :is-rounded="false"
        size="small"
        title="Previous match (Shift+Enter)"
        :disabled="matchingLineNumbers.length === 0 || isFilterMode"
        data-testid="previous-match-button"
        @click="jumpToPreviousMatch"
      >
        <template #icon>
          <KIcon
            class="button-icon"
            icon="chevronUp"
            size="16"
            title="Previous match (Shift+Enter)"
            color="currentColor"
          />
        </template>

        <span class="kutil-sr-only">Previous match</span>
      </KButton>

      <KButton
        class="next-match-button"
        type="button"
        :is-rounded="false"
        size="small"
        title="Next match (Enter)"
        :disabled="matchingLineNumbers.length === 0 || isFilterMode"
        data-testid="next-match-button"
        @click="jumpToNextMatch"
      >
        <template #icon>
          <KIcon
            class="button-icon"
            icon="chevronDown"
            size="16"
            title="Previous match (Shift+Enter)"
            color="currentColor"
          />
        </template>

        <span class="kutil-sr-only">Next match</span>
      </KButton>
    </div>

    <div class="code-block__content">
      <!-- eslint-disable vue/no-v-html -->
      <pre
        v-if="isShowingFilteredCode"
        class="filtered-code-block"
        data-testid="filtered-code-block"
      ><code v-html="filteredCode" /></pre>

      <pre
        v-else
        class="highlighted-code-block"
        data-testid="highlighted-code-block"
      ><code /></pre>
      <!-- eslint-enable vue/no-v-html -->

      <KClipboardProvider v-slot="{ copyToClipboard }">
        <KPop placement="bottom">
          <button
            class="code-block__copy-button"
            type="button"
            @click="copyToClipboard(reformattedCode)"
          >
            <KIcon
              icon="copy"
              size="24"
              color="var(--blue-500)"
            />

            <span class="kutil-sr-only">Copy</span>
          </button>

          <template #content>
            <p>Code copied to clipboard</p>
          </template>
        </KPop>
      </KClipboardProvider>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, PropType } from 'vue'
import { KButton, KClipboardProvider, KIcon, KInput, KLabel, KPop } from '@kong/kongponents'

import { debounce } from '@/utils/debounce'
import { highlightElement, highlightLines, AvailableLanguages } from '@/utils/highlightElement'
import { reformatYaml } from '@/utils/reformatYaml'
import { Storage } from '@/utils/Storage'

// Debouncing the search handler ensures that we don’t trigger several searches while the user is still typing.
const debouncedHandleSearchInputValue = debounce(handleSearchInputValue, 150)
// Debouncing the highlighter ensures we don’t accidentally trigger multiple highlighting operations in response to various reactive state changes. Sure, the true responsibility for this is the actual control flow, but it’s just too easy to run into this trap and this simple trick™ will save you from some of its consequences.
const debouncedHighlight = debounce(highlight, 10)

const props = defineProps({
  /**
   * ID value used for form elements like the search input and its label.
   */
  id: {
    type: String,
    required: true,
  },

  queryKey: {
    type: String,
    required: false,
    default: null,
  },

  language: {
    type: String as PropType<AvailableLanguages>,
    required: true,
  },

  code: {
    type: String,
    required: true,
  },

  codeMaxHeight: {
    type: String,
    required: false,
    default: null,
  },

  isSearchable: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const query = ref('')
const isProcessing = ref(false)
const isRegExpMode = ref(false)
const isFilterMode = ref(false)
const regExpError = ref<Error | null>(null)
const codeBlock = ref<HTMLElement | null>(null)
const matchingLineNumbers = ref<number[]>([])
const currentLineIndex = ref<null | number>(null)

const reformattedCode = computed(() => props.language === 'yaml' ? reformatYaml(props.code) : props.code)
const lowerCasedReformattedCode = computed(() => reformattedCode.value.toLowerCase())
const regExpButtonAppearance = computed(() => regExpError.value !== null ? 'danger' : isRegExpMode.value ? 'secondary' : 'outline')
const uniqueMatchingLineNumbers = computed(() => Array.from(new Set(matchingLineNumbers.value)))
const filteredCode = computed(function () {
  if (query.value === '') {
    return ''
  }

  return reformattedCode.value
    .split('\n')
    .map((line, index) => {
      // Don’t process non-matching lines. It is however important to keep them so we can add line number spans.
      if (!matchingLineNumbers.value.includes(index + 1)) {
        return line
      }

      try {
        const regExp = new RegExp(query.value, 'g')
        return line.replace(regExp, (match) => `<span class="matched-term">${match}</span>`)
      } catch {
        return line
      }
    })
    .map((line, index) => `<span class="line-number">${index + 1}</span>${line}`)
    .filter((_line, index) => matchingLineNumbers.value.includes(index + 1))
    .join('\n')
})
const isShowingFilteredCode = computed(() => isFilterMode.value && filteredCode.value !== '')

watch(() => reformattedCode.value, function () {
  debouncedHighlight()
})

watch(() => isRegExpMode.value, async function () {
  if (document?.activeElement?.tagName === 'PRE') {
    codeBlock.value?.focus({ preventScroll: true })
  }

  updateMatchingLineNumbers()
})

watch(() => isShowingFilteredCode.value, async function () {
  if (document?.activeElement?.tagName === 'PRE') {
    codeBlock.value?.focus({ preventScroll: true })
  }

  updateMatchingLineNumbers()

  if (!isShowingFilteredCode.value) {
    await nextTick()
    debouncedHighlight()
  }
})

watch(() => query.value, function () {
  setStoredQuery(query.value)
  updateMatchingLineNumbers()
})

onMounted(function () {
  document.addEventListener('keydown', triggerShortcuts)
  debouncedHighlight()

  if (codeBlock.value instanceof Element && props.codeMaxHeight !== null) {
    const preElements = codeBlock.value.querySelectorAll('.code-block pre') as NodeListOf<HTMLPreElement>
    for (const preElement of preElements) {
      preElement.style.setProperty('--code-max-height', props.codeMaxHeight)
    }
  }
})

onBeforeUnmount(function () {
  document.removeEventListener('keydown', triggerShortcuts)
})

query.value = getStoredQuery()

function getStoredQuery(): string {
  const queries = Storage.get('codeBlockQueries')
  const queryKey = props.queryKey ?? props.id

  return queries?.[queryKey] ? queries[queryKey] : ''
}

function setStoredQuery(queryValue: string): void {
  const queries = Storage.get('codeBlockQueries') ?? {}
  const queryKey = props.queryKey ?? props.id

  if (queryValue === '') {
    delete queries[queryKey]
  } else {
    queries[queryKey] = queryValue
  }

  Storage.set('codeBlockQueries', queries)
}

/**
 * Applies syntax highlighting to the code block
 */
function highlight(): void {
  if (document === null || !(codeBlock.value instanceof Element)) {
    return
  }

  isProcessing.value = true

  const preElement = codeBlock.value.querySelector('.highlighted-code-block')
  const codeElement = codeBlock.value.querySelector('.highlighted-code-block code')

  if (preElement instanceof Element && codeElement instanceof Element) {
    codeElement.innerHTML = reformattedCode.value
    highlightElement(preElement, codeElement, props.language)
    updateMatchingLineNumbers()

    if (typeof currentLineIndex.value === 'number') {
      const lineNumber = uniqueMatchingLineNumbers.value[currentLineIndex.value]
      if (lineNumber) {
        const nextHighlight = codeBlock.value.querySelector(`.line-highlight[data-range="${lineNumber}"]`)
        nextHighlight?.classList.add('is-current-highlight')
      }
    }
  }

  isProcessing.value = false
}

function handleSearch(inputValue: string): void {
  // Ensures that no wasted debouncing takes place when the search input value being emitted is already the stored query. This also avoids unnecessarily showing the processing icon.
  if (inputValue !== query.value) {
    isProcessing.value = true
    debouncedHandleSearchInputValue(inputValue)
  }
}

function handleSearchInputValue(inputValue: string): void {
  query.value = inputValue
}

function updateMatchingLineNumbers() {
  isProcessing.value = true
  regExpError.value = null

  // Avoids determining matching line numbers when one can expect a very large number of results. The numbers here are determined purely by gut feel and not by any scientific reasoning.
  if (!isRegExpMode.value && query.value.length > 0 && query.value.length < 3 && reformattedCode.value.length > 1000) {
    matchingLineNumbers.value = []
  } else if (query.value.length === 0) {
    matchingLineNumbers.value = []
  } else {
    try {
      matchingLineNumbers.value = getMatchingLineNumbers(lowerCasedReformattedCode.value, query.value.toLowerCase(), isRegExpMode.value)
    } catch (error) {
      matchingLineNumbers.value = []

      if (error instanceof Error) {
        regExpError.value = error
      } else {
        throw error
      }
    }
  }

  const preElement = codeBlock.value?.querySelector('.highlighted-code-block')
  if (preElement instanceof Element) {
    highlightLines(preElement, matchingLineNumbers.value)
  }

  isProcessing.value = false
}

function getMatchingLineNumbers(code: string, query: string, isRegExpMode: boolean): number[] {
  if (isRegExpMode) {
    return getMatchingLineNumbersByRegExp(code, query)
  } else {
    return getMatchingLineNumbersByExactMatch(code, query)
  }
}

function getMatchingLineNumbersByExactMatch(code: string, query: string): number[] {
  const matchingLineNumbers: number[] = []
  let startPos = 0

  while (startPos < code.length) {
    const pos = code.indexOf(query, startPos)

    if (pos === -1) {
      break
    }

    const lineNumber = code.substring(0, pos).split('\n').length
    matchingLineNumbers.push(lineNumber)

    startPos = pos + 1
  }

  return matchingLineNumbers
}

function getMatchingLineNumbersByRegExp(code: string, query: string): number[] {
  const matches = code.matchAll(new RegExp(query, 'g'))
  const matchingLineNumbers: number[] = []

  for (const match of Array.from(matches)) {
    if (match.index !== undefined) {
      const lineNumber = code.substring(0, match.index).split('\n').length
      matchingLineNumbers.push(lineNumber)
    }
  }

  return matchingLineNumbers
}

function toggleRegExpMode(): void {
  isRegExpMode.value = !isRegExpMode.value

  // Resets regexp error when toggling off regexp mode.
  if (!isRegExpMode.value) {
    regExpError.value = null
  }
}

function toggleFilterMode(): void {
  isFilterMode.value = !isFilterMode.value
}

type Command = {
  /**
   * Command handler.
   */
  trigger: (event: Event) => (Promise<void> | void)

  /**
   * The context in which triggering the command is permitted.
   *
   * Logic for triggering commands via shortcuts will check whether the allowed context is in the associated `KeyboardEvent`’s [`event.composedPath()`][1].
   *
   * [1]: https://developer.mozilla.org/en-US/docs/Web/API/Event/composedPath
   */
  allowedContext?: () => EventTarget | null

  /**
   * Disables the shortcut dynamically.
   */
  isDisabled?: () => boolean

  shouldPreventDefaultAction?: boolean
}

const commands: Record<string, Command> = {
  '/': {
    trigger: focusSearchInput,
    shouldPreventDefaultAction: true,
  },
  'alt+f': {
    trigger: toggleFilterMode,
    allowedContext: () => codeBlock.value,
  },
  'alt+g': {
    trigger: toggleFilterMode,
    allowedContext: () => codeBlock.value,
  },
  'alt+r': {
    trigger: toggleRegExpMode,
    allowedContext: () => codeBlock.value,
  },
  f3: {
    trigger: jumpToNextMatch,
    allowedContext: () => codeBlock.value,
    isDisabled: () => matchingLineNumbers.value.length === 0 || isFilterMode.value,
    shouldPreventDefaultAction: true,
  },
  'shift+f3': {
    trigger: jumpToPreviousMatch,
    allowedContext: () => codeBlock.value,
    isDisabled: () => matchingLineNumbers.value.length === 0 || isFilterMode.value,
    shouldPreventDefaultAction: true,
  },
  enter: {
    trigger: jumpToNextMatch,
    allowedContext: () => codeBlock.value,
    isDisabled: () => matchingLineNumbers.value.length === 0 || isFilterMode.value,
    shouldPreventDefaultAction: true,
  },
  'shift+enter': {
    trigger: jumpToPreviousMatch,
    allowedContext: () => codeBlock.value,
    isDisabled: () => matchingLineNumbers.value.length === 0 || isFilterMode.value,
    shouldPreventDefaultAction: true,
  },
}

const KEY_REPLACEMENT: Record<string, string> = {
  ' ': 'space',
  Control: '',
  Shift: '',
  Alt: '',
}

function triggerShortcuts(event: KeyboardEvent): void {
  const key = KEY_REPLACEMENT[event.key] !== undefined ? KEY_REPLACEMENT[event.key] : event.key.toLowerCase()
  const shortcut = [
    event.ctrlKey ? 'ctrl' : '',
    event.shiftKey ? 'shift' : '',
    event.altKey ? 'alt' : '',
    key,
  ].filter((key) => key !== '').join('+')
  const command = commands[shortcut]

  if (!command) {
    return
  }

  // Prevents invoking shortcuts from outside a certain allowed context.
  if (command.allowedContext) {
    const context = command.allowedContext()

    if (context && !event.composedPath().includes(context)) {
      return
    }
  }

  if ((command.shouldPreventDefaultAction)) {
    event.preventDefault()
  }

  if (command.isDisabled && command.isDisabled()) {
    return
  }

  command.trigger(event)
}

function jumpToNextMatch(): void {
  jumpToMatch(1)
}

function jumpToPreviousMatch(): void {
  jumpToMatch(-1)
}

function jumpToMatch(direction: number): void {
  if (uniqueMatchingLineNumbers.value.length === 0 || !(codeBlock.value instanceof HTMLElement)) {
    return
  }

  if (typeof currentLineIndex.value === 'number') {
    currentLineIndex.value = ((currentLineIndex.value + direction) + uniqueMatchingLineNumbers.value.length) % uniqueMatchingLineNumbers.value.length
  } else {
    currentLineIndex.value = 0
  }
  const lineNumber = uniqueMatchingLineNumbers.value[currentLineIndex.value]

  if (!lineNumber) {
    return
  }

  const line = codeBlock.value.querySelector(`[data-line="${lineNumber}"]`)
  if (line instanceof Element) {
    if (typeof line.scrollIntoView === 'function') {
      line.scrollIntoView({ block: 'center' })
    }

    const previousHighlight = codeBlock.value.querySelector('.line-highlight.is-current-highlight')
    previousHighlight?.classList.remove('is-current-highlight')
    const nextHighlight = codeBlock.value.querySelector(`.line-highlight[data-range="${lineNumber}"]`)
    nextHighlight?.classList.add('is-current-highlight')
  }
}

function focusSearchInput(): void {
  const searchInput = codeBlock.value?.querySelector(`#${props.id}-search`)
  if (searchInput instanceof HTMLElement) {
    searchInput.focus()
  }
}
</script>

<style lang="scss" scoped>
.code-block {
  border-radius: 5px;
}

.code-block:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--LinkColorHover);
  isolation: isolate;
}

.code-block__actions {
  height: var(--topbar-height);
  position: sticky;
  z-index: 4;
  top: var(--topbar-height);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs);
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border-bottom: 1px solid var(--grey-300);
  background-color: var(--grey-200);
}

.code-block__actions + .code-block__content > pre {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.code-block__actions > button {
  --KButtonFontSize: 1.2em;

  align-self: stretch;
  font-family: var(--code-font-family);
}

.code-search {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: 0;
}

.code-search-error {
  color: var(--red-600);
}

.code-block__content {
  position: relative;
}

.code-block__content pre {
  margin-top: 0;
  margin-bottom: 0;
  padding-top: var(--spacing-sm);
  padding-bottom: var(--spacing-sm);
  border-radius: 5px;
  background-color: var(--grey-100);
}

.code-block__content pre:focus-visible {
  outline: 2px solid var(--LinkColorHover);
  outline-offset: -2px;
  isolation: isolate;
}

.code-block__content code {
  // DO NOT REMOVE OR OVERRIDE THIS.
  // Believe it or not, this avoids a critical performance issue with highlighting code and specifically highlighting lines using Prism’s line-highlight plugin.
  // https://github.com/PrismJS/prism/issues/2062
  display: block !important;
}

.code-block__content pre,
.code-block__content code {
  tab-size: 2;
  font-size: var(--type-xs);
  font-family: var(--code-font-family);
}

.code-block__copy-button {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  display: block;
}

.code-block pre {
  max-height: var(--code-max-height, none);
}
</style>

<style lang="scss">
.line-number {
  display: inline-block;
  user-select: none;
  width: 3em;
  margin-right: 0.8em;
  padding-right: 0.8em;
  border-right: 1px solid #999;
  color: #999;
  text-align: right;
}

.is-current-highlight {
  border-left: 5px solid var(--blue-500);
  background-image: linear-gradient(to right, hsla(24, 20%, 50%, 0.15) 70%, hsla(24, 20%, 50%, 0));
}

.matched-term {
  color: var(--red-600);
  font-weight: 900;
}

// Removes unnecessary padding since we’re hiding the button text visually
.code-block__actions .button-icon.kong-icon {
  padding-right: 0;
}
</style>
