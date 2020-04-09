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

    <div
      class="tab__content-container"
      :class="{ 'has-border': hasBorder }"
    >
      <KTabs
        v-if="isReady"
        :key="activeTab"
        v-model="activeTab"
        :tabs="tabs"
        @changed="hash => switchTab(hash)"
      >
        <template
          v-for="(tab, i) in tabs"
          :slot="tab.hash.replace('#','')"
        >
          <slot :name="tab.hash.replace('#','')" />
        </template>
      </KTabs>

      <div v-if="loaders === true">
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
    loaders: {
      type: Boolean,
      default: true
    },
    vuexState: {
      type: String,
      default: 'updateSelectedTab'
    },
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
    tabs: {
      type: Array,
      required: true
    },
    tabGroupTitle: {
      type: String,
      default: null
    },
    hasBorder: {
      type: Boolean,
      default: false
    },
    tabState: {
      type: String,
      default: null
    },
    initialTabOverride: {
      type: String,
      required: false,
      default: null
    }
  },
  computed: {
    activeTab: {
      get () {
        if (!this.tabState) {
          return this.$store.state.selectedTab
        } else {
          return `#${this.$store.state[this.tabState]}`
        }
      },
      set (newTab) {
        return newTab
      }
    },
    isReady () {
      if (this.loaders !== false) {
        return !this.isEmpty && !this.hasError && !this.isLoading
      } else {
        return true
      }
    }
  },
  beforeMount () {
    // display the first tab on load
    this.$store.dispatch(this.vuexState, `#${this.initialTabOverride}` || this.tabs[0].hash)
  },
  methods: {
    switchTab (newTab) {
      this.activeTab = newTab
      this.$store.dispatch(this.vuexState, newTab)
    }
  }
}
</script>

<style lang="scss" scoped>
.tab-container {
  --tab-container-margin: var(--spacing-lg) 0 0 0;
  --tab-header-margin: 0 0 var(--spacing-md) 0;
  --tab-header-padding: 0 var(--spacing-md);
  --tab-nav-border-bottom: 1px solid var(--gray-4);
  --tab-link-radius: 3px 3px 0 0;
  --tab-link-padding: var(--spacing-sm) var(--spacing-lg);
  --tab-link-gap: var(--spacing-sm);
  --tab-link-active-text-color: var(--blue-4);
  --tab-active-background-color: var(--gray-7);
  --tab-link-background-color: #fff;
  --tab-link-border: 1px solid var(--gray-4);
  --tab-active-border-color: var(--gray-4);
  --tab-panel-padding: var(--spacing-sm);
  --tab-panel-border: 1px solid var(--gray-4);
  --tab-panel-radius: 0 0 3px 3px;

  margin: var(--tab-container-margin);
}

.tab__header {
  margin: var(--tab-header-margin);
  padding: var(--tab-header-padding);
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
  margin-left: var(--tab-link-gap);
}

@mixin active-link-background {
  background-color: var(--tab-active-background-color);
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
    @include active-link-background;

    color: var(--tab-link-active-text-color);
  }
}

.tab__nav-item--active {

  .tab__nav-link {
    @include active-link-border;
    @include active-link-background;

    color: var(--tab-link-active-text-color);
  }
}

.tab__content-container {
  position: relative;
  z-index: 1;
}

.tab__content-panel {
  // padding: var(--tab-panel-padding);

  &.has-border {
    border: var(--tab-panel-border);
    border-top: 0;
    border-radius: var(--tab-panel-radius);
  }
}
</style>
