<template>
  <div
    class="tab-container"
    data-testid="tab-container"
  >
    <LoadingBlock v-if="isLoading" />

    <ErrorBlock
      v-else-if="error !== null"
      :error="error"
    />

    <template v-else>
      <header
        v-if="$slots.tabHeader"
        class="tab__header"
      >
        <slot name="tabHeader" />
      </header>

      <div class="tab__content-container">
        <KTabs
          v-model="tabState"
          :tabs="tabs"
          @changed="hash => switchTab(hash)"
        >
          <template
            v-for="tab in tabsSlots"
            #[tab]
          >
            <slot :name="tab" />
          </template>

          <template #warnings-anchor>
            <span class="flex items-center with-warnings">
              <KIcon
                class="mr-1"
                icon="warning"
                color="var(--black-75)"
                secondary-color="var(--yellow-300)"
                size="16"
              />

              <span>Warnings</span>
            </span>
          </template>
        </KTabs>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { datadogLogs } from '@datadog/browser-logs'
import { KIcon, KTabs } from '@kong/kongponents'

import { datadogLogEvents } from '@/datadogEvents'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import { computed, PropType, ref } from 'vue'

const props = defineProps({
  tabs: {
    type: Array as PropType<Array<{ hash: string, title: string }>>,
    required: true,
  },

  isLoading: {
    type: Boolean,
    required: false,
    default: false,
  },

  isEmpty: {
    type: Boolean,
    required: false,
    default: false,
  },

  hasError: {
    type: Boolean,
    required: false,
    default: false,
  },

  error: {
    type: [Error, null] as PropType<Error | null>,
    required: false,
    default: null,
  },

  hasBorder: {
    type: Boolean,
    required: false,
    default: false,
  },

  initialTabOverride: {
    type: String,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['on-tab-change'])

const tabState = ref(props.initialTabOverride && `#${props.initialTabOverride}`)

const tabsSlots = computed(() => props.tabs.map((tab) => tab.hash.replace('#', '')))

function switchTab(newTab: string): void {
  datadogLogs.logger.info(datadogLogEvents.TABS_TAB_CHANGE, {
    data: {
      newTab,
    },
  })

  emit('on-tab-change', newTab)
}
</script>

<style>
.k-tabs ul .tab-link {
  text-decoration: none !important;
}
</style>

<style lang="scss" scoped>
.tab-container {
  --tab-container-margin: var(--spacing-lg) 0 0 0;
  --tab-header-margin: 0 0 var(--spacing-md) 0;
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

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: var(--tab-header-title-font-size);
    font-weight: var(--tab-header-title-font-weight);
  }

  > div,
  > h3 {
    padding: 0 10px;
  }
}

.tab__header > :not(:first-child) {
  margin-left: var(--spacing-md);
}

.tab__content-container {
  position: relative;
  z-index: 1;
}

.with-warnings {
  color: var(--yellow-500);
}
</style>
