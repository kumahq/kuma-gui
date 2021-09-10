<template>
  <ul class="accordion">
    <slot />
  </ul>
</template>

<script>
export default {
  name: 'Accordion',
  props: {
    initiallyOpen: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      parentAccordion: {
        count: 0,
        active: this.initiallyOpen,
      },
    }
  },
  provide() {
    return { parentAccordion: this.parentAccordion }
  },
}
</script>

<style lang="scss" scoped>
.accordion {
  & > li:last-child {
    border-bottom: none;
  }
}
</style>
