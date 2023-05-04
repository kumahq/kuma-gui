<template>
  <li
    class="accordion-item"
    :class="{ active: visible }"
  >
    <button
      class="accordion-item-header"
      type="button"
      :aria-expanded="visible ? 'true' : 'false'"
      data-testid="accordion-item-button"
      @click="open"
    >
      <slot name="accordion-header" />
    </button>

    <transition
      name="accordion"
      @enter="start"
      @after-enter="end"
      @before-leave="start"
    >
      <div
        v-if="visible"
        class="accordion-item-content"
        data-testid="accordion-item-content"
      >
        <slot name="accordion-content" />
      </div>
    </transition>
  </li>
</template>

<script lang="ts" setup>
import { computed, inject, Ref, ref } from 'vue'

const parentAccordion = inject<{
  multipleOpen: boolean
  active: Ref<number | number[] | null>
  count: Ref<number>
}>('parentAccordion')

const index = ref<number | null>(null)

const visible = computed(() => {
  if (parentAccordion === undefined) {
    return false
  }

  if (parentAccordion.multipleOpen && Array.isArray(parentAccordion.active.value) && index.value !== null) {
    return parentAccordion.active.value.includes(index.value)
  }

  return index.value === parentAccordion.active.value
})

if (parentAccordion !== undefined) {
  index.value = parentAccordion.count.value++
}

function open(): void {
  if (visible.value) {
    hideItem()
  } else {
    showItem()
  }
}

function hideItem(): void {
  if (parentAccordion === undefined) {
    return
  }

  if (parentAccordion.multipleOpen && Array.isArray(parentAccordion.active.value) && index.value !== null) {
    parentAccordion.active.value.splice(parentAccordion.active.value.indexOf(index.value), 1)
  } else {
    parentAccordion.active.value = null
  }
}

function showItem(): void {
  if (parentAccordion === undefined) {
    return
  }

  if (parentAccordion.multipleOpen && Array.isArray(parentAccordion.active.value) && index.value !== null) {
    parentAccordion.active.value.push(index.value)
  } else {
    parentAccordion.active.value = index.value
  }
}

function start(element: Element) {
  if (element instanceof HTMLElement) {
    element.style.height = `${element.scrollHeight}px`
  }
}

function end(element: Element) {
  if (element instanceof HTMLElement) {
    element.style.height = 'auto'
  }
}
</script>

<style lang="scss" scoped>
.accordion-item {
  position: relative;
  border-bottom: var(--KCardBorder);
}

.accordion-item:last-child {
  border-bottom: none;
}

.accordion-enter-active,
.accordion-leave-active {
  will-change: height, opacity;
  transition: height 0.3s ease, opacity 0.3s ease;
  overflow: hidden;
}

.accordion-enter,
.accordion-leave-to {
  height: 0 !important;
  opacity: 0;
}

.active {
  .accordion-item-header::after {
    margin-left: var(--spacing-sm);
    transform: rotate(-180deg) translateY(-50%);
    top: calc(50% - 4px);
  }
}

.accordion-item-header {
  position: relative;
  display: block;
  width: 100%;
  text-align: left;
  padding-top: var(--spacing-xs);
  padding-bottom: var(--spacing-xs);

  &::after {
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    content: '';
    border-top: 0.325em solid;
    border-right: 0.325em solid transparent;
    border-left: 0.325em solid transparent;
    transition: 0.25s ease;
  }
}

.accordion-item-content {
  padding-top: var(--spacing-xs);
  padding-bottom: var(--spacing-xs);
}
</style>
