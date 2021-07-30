<template>
  <div class="tab-container">
    <header
      v-if="$slots.tabHeader && isReady"
      class="tab__header"
    >
      <slot name="tabHeader" />
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
          v-for="tab in tabs"
          :slot="tab.hash.replace('#','')"
        >
          <slot :name="tab.hash.replace('#','')" />
        </template>

        <template
          slot="warnings-anchor"
        >
          <span class="flex items-center with-warnings">
            <KIcon
              color="var(--yellow-400)"
              class="mr-1"
              icon="warning"
              view-box="0 0 18 16"
              size="16"
            />
            <span>
              Warnings
            </span>
          </span>
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
                color="var(--yellow-200)"
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
      default: null
    }
  },
  computed: {
    activeTab: {
      get () {
        if (!this.tabState) {
          return this.tabs[0].hash
        } else {
          return `#${this.tabState}`
        }
      },
      set (newTab) {
        this.$emit('onTabChange', newTab)

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
  methods: {
    switchTab (newTab) {
      this.activeTab = newTab
    }
  }
}
</script>

<style>
.k-tabs ul .tab-link {
  text-decoration: none !important;
}

.tab__header .k-button:after {
  display: none !important;
}
</style>

<style lang="scss" scoped>
.tab-container {
  --tab-container-margin: var(--spacing-lg) 0 0 0;
  --tab-header-margin: 0 -10px var(--spacing-md) -10px;
  --tab-header-padding: 0 var(--spacing-md);
  --tab-header-title-font-size: var(--type-md);
  --tab-header-title-font-weight: 500;
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
  display: flex;
  align-items: center;
  margin: var(--tab-header-margin);
  padding: var(--tab-header-padding);

  h1, h2, h3, h4, h5, h6 {
    font-size: var(--tab-header-title-font-size);
    font-weight: var(--tab-header-title-font-weight);
  }

  > div {
    padding: 0 10px;
  }
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

.with-warnings {
  color: var(--yellow-400)
}
</style>
