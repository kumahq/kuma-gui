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
          v-model="activeTabHash"
          :tabs="tabs"
          @changed="switchTab"
        >
          <template
            v-for="(tab, index) in tabsSlots"
            :key="index"
            #[tab]
          >
            <KCard border-variant="noBorder">
              <template #body>
                <slot :name="tab" />
              </template>
            </KCard>
          </template>

          <template #warnings-anchor>
            <span class="flex items-center with-warnings">
              <KIcon
                class="mr-1"
                icon="warning"
                color="var(--black-500)"
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
import { KCard, KIcon, KTabs } from '@kong/kongponents'
import { computed, PropType, ref } from 'vue'

import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import { datadogLogEvents } from '@/utilities/datadogLogEvents'
import { QueryParameter } from '@/utilities/QueryParameter'

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

const emit = defineEmits<{
  (event: 'on-tab-change', tabHash: string): void,
}>()

const activeTabHash = ref('')

const tabsSlots = computed(() => props.tabs.map((tab) => tab.hash.replace('#', '')))

function start() {
  const tab = QueryParameter.get('tab')

  if (tab !== null) {
    activeTabHash.value = `#${tab}`
  } else if (props.initialTabOverride !== null) {
    activeTabHash.value = `#${props.initialTabOverride}`
  }
}

start()

function switchTab(newActiveTabHash: string): void {
  QueryParameter.set('tab', newActiveTabHash.substring(1))

  datadogLogs.logger.info(datadogLogEvents.TABS_TAB_CHANGE, {
    data: {
      newActiveTabHash,
    },
  })

  emit('on-tab-change', newActiveTabHash)
}
</script>

<style lang="scss" scoped>
.tab-container {
  --tab-container-margin: var(--spacing-lg) 0 0 0;
  --tab-header-margin: 0 0 var(--spacing-md) 0;
  --tab-header-padding: 0 var(--spacing-md);
  --tab-header-title-font-size: var(--type-md);
  --tab-header-title-font-weight: 600;
  --tab-nav-border-bottom: var(--KCardBorder);
  --tab-link-radius: 3px 3px 0 0;
  --tab-link-padding: var(--spacing-sm) var(--spacing-lg);
  --tab-link-gap: var(--spacing-sm);
  --tab-link-active-text-color: var(--blue-300);
  --tab-active-background-color: var(--grey-100);
  --tab-link-background-color: var(--white);
  --tab-link-border: var(--KCardBorder);
  --tab-active-border-color: var(--grey-300);
  --tab-panel-padding: var(--spacing-sm);
  --tab-panel-border: var(--KCardBorder);
  --tab-panel-radius: 0 0 3px 3px;

  margin: var(--tab-container-margin);
}

.tab__header {
  display: flex;
  align-items: center;
  margin: var(--tab-header-margin);
  padding: var(--tab-header-padding);
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
