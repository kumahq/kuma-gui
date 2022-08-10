<template>
  <ul class="accordion">
    <slot />
  </ul>
</template>

<script>
export default {
  name: 'AccordionList',
  provide() {
    return { parentAccordion: this.parentAccordion }
  },
  props: {
    initiallyOpen: {
      type: [Number, Array],
      default: null,
    },
    multipleOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    let active
    if (this.initiallyOpen !== null) {
      active = this.initiallyOpen
    } else {
      active = this.multipleOpen ? [] : null
    }

    return {
      parentAccordion: {
        count: 0,
        active,
        multipleOpen: this.multipleOpen,
      },
    }
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
