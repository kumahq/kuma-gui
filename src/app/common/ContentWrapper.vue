<template>
  <div class="content-wrapper">
    <div class="content-wrapper__content component-frame">
      <slot name="content" />
    </div>

    <div
      v-if="slots.sidebar"
      class="content-wrapper__sidebar component-frame"
    >
      <slot name="sidebar" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useSlots } from 'vue'

const slots = useSlots()
</script>

<style lang="scss" scoped>
.content-wrapper {
  display: flex;
  // Allows the contained flex items to wrap when their sizing requirements can’t be satisfied any longer.
  flex-wrap: wrap;
  align-items: flex-start;
  gap: var(--spacing-lg);
}

.content-wrapper__content {
  flex-basis: 0;
  flex-grow: 999;
  // Sets the minimum size of the content element. Effectively, this behaves as a trigger for the flex items to wrap. Once this element would take up less space that this size, others items will wrap onto new flex rows because this element’s sizing requirements are no longer met.
  min-inline-size: 66.666%;
  background-color: var(--white);
}

.content-wrapper__sidebar {
  // Ensures this element always takes up a minimum size but never more than 100%.
  flex-basis: min(60ch, 100%);
  // Lets the element take up all available space. Applies when the content and the sidebar are wrapped onto separate lines.
  flex-grow: 1;
  min-inline-size: 0;
  // Makes sidebar stick to the viewport while taking the height of the fixed top bar into account.
  position: sticky;
  top: calc(var(--topbar-height) + var(--spacing-lg));
  bottom: var(--spacing-lg);
  background-color: var(--white);
}
</style>
