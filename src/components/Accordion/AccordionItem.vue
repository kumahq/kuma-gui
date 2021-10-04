<template>
  <li :class="accordionItemClasses">
    <div
      class="accordion-item-header"
      @click="open"
    >
      <!-- This slot will display header -->
      <slot name="accordion-header" />
    </div>

    <transition
      name="accordion"
      @enter="start"
      @after-enter="end"
      @before-leave="start"
    >
      <div v-if="visible">
        <!-- This slot will display whole content -->
        <slot name="accordion-content" />
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
      if (this.parentAccordion.multipleOpen) {
        return this.parentAccordion.active.includes(this.index)
      }

      return this.index === this.parentAccordion.active
    },
    accordionItemClasses() {
      return ['relative border-b py-2 px-4', { active: this.visible }]
    },
  },
  created() {
    this.index = this.parentAccordion.count++
  },
  methods: {
    hideItem() {
      if (this.parentAccordion.multipleOpen) {
        this.parentAccordion.active.splice(this.parentAccordion.active.indexOf(this.index), 1)
      } else {
        this.parentAccordion.active = null
      }
    },
    showItem() {
      if (this.parentAccordion.multipleOpen) {
        this.parentAccordion.active.push(this.index)
      } else {
        this.parentAccordion.active = this.index
      }
    },
    open() {
      if (this.visible) {
        this.hideItem()
      } else {
        this.showItem()
      }
    },
    start(el) {
      el.style.height = `${el.scrollHeight}px`
    },
    end(el) {
      el.style.height = 'auto'
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

.active {
  .accordion-item-header::after {
    transform: rotate(-180deg) translateY(-50%);
  }
}

.accordion-item-header {
  @apply py-2 cursor-pointer pr-4 relative;

  &::after {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    content: '';
    border-top: 0.325em solid;
    border-right: 0.325em solid transparent;
    border-left: 0.325em solid transparent;
    transition: 0.25s ease;
  }
}
</style>
