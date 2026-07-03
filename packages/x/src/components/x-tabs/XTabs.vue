<template>
  <nav
    :class="`x-tabs ${props.variant}`"
  >
    <ul>
      <li
        v-for="(_, name) in slots"
        :key="`${name}`"
        :class="{'active': name === `${props.selected}-tab`}"
        role="none"
        :data-testid="`${name}`"
      >
        <slot :name="name" />
      </li>
    </ul>
  </nav>
</template>
<script lang="ts" setup>
const props = withDefaults(defineProps<{
  selected?: string
  variant?: 'default' | 'small'
}>(), {
  selected: '',
  variant: 'default',
})
const slots = defineSlots()
</script>
<style lang="scss" scoped>
.x-tabs {

  &.default {
    /* initial */
    :deep(:where(a, span)) {
      border: none;
      border-radius: var(--x-border-radius-30);

      background-color: var(--x-color-background-transparent);
      color: var(--x-color-text-neutral);

      transition:
        color var(--x-animation-duration-20) ease-in-out,
        background-color var(--x-animation-duration-20) ease-in-out;

      font-family: var(--x-font-family-text);
      font-size: var(--x-font-size-30);
      font-weight: var(--x-font-weight-semibold);
      line-height: var(--x-line-height-40);

      text-decoration: none;
      cursor: pointer;
      user-select: none;

      display: inline-flex;
      align-items: center;
      gap: var(--x-space-40);
      padding: var(--x-space-30) var(--x-space-50);
    }

    /* disabled */
    :deep(span) {
      color: var(--x-color-text-disabled);
      cursor: not-allowed;
    }


    /* hover/focus */
    :deep(a:hover),
    :deep(a:focus-visible) {
      background-color: var(--x-color-background-neutral-weaker);
    }


    /* selected / active / current */
    li.active :deep(a),
    :deep(a:focus-visible) {
      color: var(--x-color-text);
    }

  }

  &.small {
    /* initial */
    :deep(:where(a, span)) {
      border-radius: var(--x-border-radius-20);
      color: var(--x-color-text-neutral);
      font-size: var(--x-font-size-20);
      font-weight: var(--x-font-weight-medium);
      line-height: var(--x-line-height-30);
      transition:
        color var(--x-animation-duration-20) ease-in-out,
        font-weight var(--x-animation-duration-20) ease-in-out;
    }

    /* hover/focus */
    :deep(a:hover),
    :deep(a:focus-visible) {
      color: var(--x-color-text-neutral-stronger);
    }

    /* disabled */
    :deep(span) {
      color: var(--x-color-text-disabled);
      cursor: not-allowed;
    }

    /* selected / active / current */
    li.active :deep(a) {
      color: var(--x-color-text);
    }

  }

  /* non-link */
  ul {
    /* these were removed from .small */
    /* but I think we should keep them on both variants */
    overflow-x: auto;
    overflow-y: hidden;

    display: flex;
    gap: var(--x-space-40);
    list-style: none;

    padding: 0;
    margin: 0;
    margin-top: var(--x-space-0);
    padding-top: var(--x-space-20);

    li {
      white-space: nowrap;
    }
  }

  &.default {
    ul {
      border-bottom: var(--x-border-width-10) solid var(--x-color-border);

      margin-bottom: var(--x-space-70);
      padding: var(--x-space-0) var(--x-space-70);
      padding-top: var(--x-space-20);

      li {
        border-bottom-color: var(--x-color-border-transparent);
        border-bottom-style: solid;
        border-bottom-width: var(--x-border-width-20);

        transition:
          border-bottom-color var(--x-animation-duration-20) ease-in-out;

        position: relative;
        padding-bottom: var(--x-space-40);

        &.active {
          border-bottom-color: var(--x-color-border-decorative-purple);
        }
      }
    }
  }

  &.small {
    ul {
      align-items: center;
      gap: var(--x-space-70);
      margin-bottom: var(--x-space-50);
    }
  }
}
</style>
