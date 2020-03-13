<template>
  <div class="tab-container">
    <header
      v-if="tabGroupTitle"
      class="tab__header"
    >
      <h3 class="xl">
        {{ tabGroupTitle }}
      </h3>
    </header>
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
      <div
        v-if="isReady"
        class="tab__content-panel"
      >
        <slot :name="tabContentSlotName" />
      </div>

      <!-- loading state -->
      <KEmptyState
        v-if="isLoading"
        cta-is-hidden
      >
        <template slot="title">
          <div class="card-icon mb-3">
            <KIcon
              icon="spinner"
              color="rgba(0, 0, 0, 0.1)"
              size="42"
            />
          </div>
          Data Loading...
        </template>
      </KEmptyState>

      <!-- error has occurred -->
      <KEmptyState
        v-if="hasError"
        cta-is-hidden
      >
        <template slot="title">
          <div class="card-icon mb-3">
            <KIcon
              class="kong-icon--centered"
              color="var(--yellow-base)"
              icon="warning"
              size="42"
            />
          </div>
          An error has occurred while trying to load this data.
        </template>
      </KEmptyState>
    </div>
  </div>
</template>

<script>
import KEmptyState from '@kongponents/kemptystate'

export default {
  name: 'Tabs',
  components: {
    KEmptyState
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    isEmpty: {
      type: Boolean,
      default: false
    },
    hasError: {
      type: Boolean,
      default: false
    },
    initialTab: {
      type: String,
      required: true
    },
    tabs: {
      type: Array,
      required: true
    },
    tabGroupTitle: {
      type: String,
      required: false,
      default: null
    }
  },
  data () {
    return {
      activeTab: this.initialTab
    }
  },
  computed: {
    isReady () {
      return !this.isEmpty && !this.hasError && !this.isLoading
    },
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
  --tab-container-margin: var(--spacing-xl) 0;
  --tab-header-margin: 0 0 var(--spacing-md) 0;
  --tab-nav-border-bottom: 1px solid var(--gray-4);
  --tab-link-radius: 3px 3px 0 0;
  --tab-link-padding: var(--spacing-sm) var(--spacing-lg);
  --tab-link-gap: 0;
  --tab-link-active-text-color: var(--blue-4);
  --tab-link-background-color: #fff;
  --tab-link-active-border-color: var(--gray-2);
  --tab-link-border: 1px solid var(--gray-4);
  --tab-active-border-color: var(--gray-2);
  --tab-panel-padding: var(--spacing-sm);
  --tab-panel-border: 1px solid var(--gray-4);
  --tab-panel-radius: 0 0 3px 3px;

  margin: var(--tab-container-margin);
}

.tab__header {
  margin: var(--tab-header-margin);
}

.tab__nav {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: stretch;
  text-align: center;
  margin-bottom: -1px;
  border-bottom: var(--tab-nav-border-bottom);
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

.tab__content-panel {
  padding: var(--tab-panel-padding);
  border: var(--tab-panel-border);
  border-top: 0;
  border-radius: var(--tab-panel-radius);
}
</style>
