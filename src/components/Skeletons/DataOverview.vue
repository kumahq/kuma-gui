<template>
  <div class="data-overview">
    <MetricGrid
      v-if="!isLoading && displayMetrics && metricsData"
      :metrics="metricsData"
    />
    <KEmptyState
      v-if="isLoading"
      cta-is-hidden
    >
      <template slot="title">
        {{ emptyState.title }}
      </template>
      <template
        v-if="showCta"
        slot="message"
      >
        <router-link
          v-if="ctaAction && ctaAction.length"
          :to="ctaAction"
        >
          {{ emptyState.ctaText }}
        </router-link>
        {{ emptyState.message }}
      </template>
    </KEmptyState>
    <KTable
      v-if="displayDataTable && tableData"
      :options="tableData"
    >
      <template
        slot="actions"
        slot-scope="{ row }"
      >
        <router-link
          :to="{
            name: tableActionsRouteName,
            params: {
              mesh: row.name,
              dataplane: row.dataplane !== undefined ? row.dataplane : ''
            }
          }"
        >
          <slot name="tableDataActionsLinkText" />
        </router-link>
      </template>
    </KTable>
    <div
      v-if="$slots.content"
      class="data-overview-content mt-4"
    >
      <slot name="content" />
    </div>
  </div>
</template>

<script>
import MetricGrid from '@/components/Metrics/MetricGrid'

export default {
  name: 'DataOverview',
  components: {
    MetricGrid
  },
  props: {
    displayMetrics: {
      type: Boolean,
      default: false
    },
    metricsData: {
      type: Array,
      default: null
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    hasError: {
      type: Boolean,
      default: false
    },
    isEmpty: {
      type: Boolean,
      default: false
    },
    emptyState: {
      type: Object,
      default: null
    },
    ctaAction: {
      type: Object,
      default: () => {}
    },
    showCta: {
      type: Boolean,
      default: true
    },
    displayDataTable: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Object,
      default: null
    },
    tableDataActionsLink: {
      type: String,
      default: null
    },
    tableActionsRouteName: {
      type: String,
      default: null
    }
  },
  computed: {
    isReady () {
      return !this.isEmpty && !this.hasError && !this.isLoading
    }
  }
}
</script>

<style lang="scss">
.empty-state-title {

  .card-icon {
    text-align: center;

    img {
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
  }
}
</style>
