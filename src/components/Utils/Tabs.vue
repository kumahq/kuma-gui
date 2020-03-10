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

<style lang="scss" scoped>
.tab-container {
  --tab-nav-border-bottom: 1px solid #eee;
  --tab-link-radius: 3px 3px 0 0;
  --tab-link-padding: var(--spacing-sm) var(--spacing-lg);
  --tab-link-gap: var(--spacing-sm);
  --tab-active-background-color: var(--gray-4);

  margin: 2rem 0;
}

.tab__nav {
  display: flex;
  align-items: stretch;
  text-align: center;
  margin-bottom: -1px;
  // border-bottom: var(--tab-nav-border-bottom);
}

.tab__nav-item {

  &:not(:last-of-type) {
    margin-right: var(--tab-link-gap);
  }
}

.tab__nav-link {
  display: block;
  padding: var(--tab-link-padding);
  border-radius: var(--tab-link-radius);
}

.tab__nav-item--active {

  .tab__nav-link {
    background-color: var(--tab-active-background-color);
  }
}

.tab__content-container {

}
</style>
