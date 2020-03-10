<template>
  <div class="tab-container">
    <ul class="tab__nav">
      <li
        v-for="tab in tabs"
        :key="tab"
        :class="{ 'tab__nav-item--active': activeTab === tab }"
        class="tab__nav-item"
      >
        <a
          href="#"
          class="tab__nav-link"
          @click.prevent="switchTab(tab)"
        >
          <slot :name="tabNavItemSlotName(tab)">
            {{ tab }}
          </slot>
        </a>
      </li>
    </ul>
    <div class="tab__content-container">
      <slot :name="tabContentSlotName" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tabs',
  props: {
    initialTab: {
      type: String,
      required: true
    },
    tabs: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      activeTab: this.initialTab
    }
  },
  computed: {
    tabContentSlotName () {
      return `tab-content-${this.activeTab}`
    }
  },
  methods: {
    tabNavItemSlotName (tabItem) {
      return `tab-link-${tabItem}`
    },
    switchTab (tabItem) {
      this.activeTab = tabItem
    }
  }
}
</script>

<style>

</style>
