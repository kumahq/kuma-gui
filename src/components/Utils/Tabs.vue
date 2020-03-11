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
          class="tab__nav-link"
          :aria-selected="(activeTab === tab).toString()"
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
  --tab-link-gap: 0;
  --tab-link-active-text-color: var(--blue-4);
  --tab-link-background-color: #fff;
  --tab-link-active-border-color: var(--gray-2);
  --tab-link-border: 1px solid var(--gray-4);
  --tab-active-border-color: var(--gray-2);

  margin: 2rem 0;
}

.tab__nav {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: stretch;
  text-align: center;
  margin-bottom: -1px;
}

.tab__nav-item {

  &:not(:last-of-type) {
    margin-right: var(--tab-link-gap);
  }
}

@mixin active-link-border {
  border-top-color: var(--tab-active-border-color);
  border-right-color: var(--tab-active-border-color);
  border-left-color: var(--tab-active-border-color);
}

.tab__nav-link {
  display: block;
  background-color: var(--tab-link-background-color);
  padding: var(--tab-link-padding);
  border-radius: var(--tab-link-radius);
  border: var(--tab-link-border);
  border-bottom-color: #fff;
  cursor: pointer;

  &:hover {
    @include active-link-border;

    color: var(--tab-link-active-text-color);
  }
}

.tab__nav-item--active {

  .tab__nav-link {
    @include active-link-border;

    color: var(--tab-link-active-text-color);
  }
}

.tab__content-container {
  position: relative;
  z-index: 1;
}
</style>
