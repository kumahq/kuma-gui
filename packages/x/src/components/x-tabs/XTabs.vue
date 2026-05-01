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
    :deep(a) {
      border: none;
      border-radius: var(--kui-border-radius-30, $kui-border-radius-30);

      background-color: var(--kui-color-background-transparent, $kui-color-background-transparent);
      color: var(--kui-color-text-neutral, $kui-color-text-neutral);

      transition:
        color var(--kui-animation-duration-20, $kui-animation-duration-20) ease-in-out,
        background-color var(--kui-animation-duration-20, $kui-animation-duration-20) ease-in-out;

      font-family: var(--kui-font-family-text, $kui-font-family-text);
      font-size: var(--kui-font-size-30, $kui-font-size-30);
      font-weight: var(--kui-font-weight-semibold, $kui-font-weight-semibold);
      line-height: var(--kui-line-height-40, $kui-line-height-40);

      text-decoration: none;
      cursor: pointer;
      user-select: none;

      display: inline-flex;
      align-items: center;
      gap: var(--kui-space-40, $kui-space-40);
      padding: var(--kui-space-30, $kui-space-30) var(--kui-space-50, $kui-space-50);

  /* ? */
      :slotted(a),
      :deep(a) {
        color: var(--kui-color-text-neutral, $kui-color-text-neutral);
        text-decoration: none;
      }
  /* ? */

    }

    /* disabled */
    :deep(a.disabled) {
      color: var(--kui-color-text-disabled, $kui-color-text-disabled);
      cursor: not-allowed;
    }

    /* hover/focus */
    :deep(a:hover:not(.disabled)),
    :deep(a:focus-visible) {
      background-color: var(--kui-color-background-neutral-weaker, $kui-color-background-neutral-weaker);
    }

    /* focus ring */
    :deep(a:focus-visible) {
      box-shadow: var(--kui-shadow-focus, $kui-shadow-focus);
      outline: none;
    }

    /* selected / active / current */
    li.active :deep(a),
    :deep(a:focus-visible) {
      color: var(--kui-color-text, $kui-color-text);
    }


  }

  &.small {
    /* initial */
    :deep(a) {
      border-radius: var(--kui-border-radius-20, $kui-border-radius-20);
      color: var(--kui-color-text-neutral, $kui-color-text-neutral);
      font-size: var(--kui-font-size-20, $kui-font-size-20);
      font-weight: var(--kui-font-weight-medium, $kui-font-weight-medium);
      line-height: var(--kui-line-height-30, $kui-line-height-30);
      transition:
        color var(--kui-animation-duration-20, $kui-animation-duration-20) ease-in-out,
        font-weight var(--kui-animation-duration-20, $kui-animation-duration-20) ease-in-out;

      &:hover:not(.disabled) {
        color: var(--kui-color-text-neutral-stronger, $kui-color-text-neutral-stronger);
      }
    }

    /* disabled */
    :deep(a.disabled) {
      color: var(--kui-color-text-disabled, $kui-color-text-disabled);
      cursor: not-allowed;
    }

    /* selected / active / current */
    li.active :deep(a) {
      color: var(--kui-color-text, $kui-color-text);
    }

  }

  /* non-link */
  ul {
    /* these were removed from .small */
    /* but I think we should keep them on both variants */
    overflow-x: auto;
    overflow-y: hidden;

    display: flex;
    gap: var(--kui-space-40, $kui-space-40);
    list-style: none;

    padding: 0;
    margin: 0;
    margin-top: var(--kui-space-0, $kui-space-0);
    padding-top: var(--kui-space-20, $kui-space-20);

    li {
      white-space: nowrap;
    }
  }

  &.default {
    ul {
      border-bottom: var(--kui-border-width-10, $kui-border-width-10) solid var(--kui-color-border, $kui-color-border);

      margin-bottom: var(--kui-space-70, $kui-space-70);
      padding: var(--kui-space-0, $kui-space-0) var(--kui-space-70, $kui-space-70);
      padding-top: var(--kui-space-20, $kui-space-20);

      li {
        border-bottom-color: var(--kui-color-border-transparent, $kui-color-border-transparent);
        border-bottom-style: solid;
        border-bottom-width: var(--kui-border-width-20, $kui-border-width-20);

        transition:
          border-bottom-color var(--kui-animation-duration-20, $kui-animation-duration-20) ease-in-out;

        position: relative;
        padding-bottom: var(--kui-space-40, $kui-space-40);

        &.active {
          border-bottom-color: var(--kui-color-border-decorative-purple, $kui-color-border-decorative-purple);
        }
      }
    }
  }

  &.small {
    ul {
      gap: var(--kui-space-70, $kui-space-70);
      margin-bottom: var(--kui-space-50, $kui-space-50);
    }
  }
}
</style>
