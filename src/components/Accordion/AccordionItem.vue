<template>
  <li class="relative cursor-pointer border-b py-2 px-4">
    <div
      class="flex py-2"
      @click="open"
    >
      <!-- This slot will display header -->
      <slot name="accordion-header" />
    </div>

    <transition
      name="accordion"
      @enter="start"
      @before-leave="start"
    >
      <div v-show="visible">
        <ul>
          <!-- This slot will display whole content -->
          <slot name="accordion-content" />
        </ul>
      </div>
    </transition>
  </li>
</template>

<script>
export default {
  name: 'AccordionItem',
  inject: ['parentAccordion'],
  data() {
    return {
      index: null,
    }
  },
  computed: {
    visible() {
      return this.index === this.parentAccordion.active
    },
  },
  created() {
    this.index = this.parentAccordion.count++
  },
  methods: {
    open() {
      if (this.visible) {
        this.parentAccordion.active = null
      } else {
        this.parentAccordion.active = this.index
      }
    },
    start(el) {
      el.style.height = `${el.scrollHeight}px`
    },
  },
}
</script>

<style lang="scss" scoped>
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
</style>
