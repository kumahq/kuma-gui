<template>
  <div class="data-overview">
    <div
      v-if="isReady"
      class="data-overview-content"
    >
      <!-- metrics -->
      <MetricGrid
        v-if="!isLoading && displayMetrics && metricsData"
        :metrics="metricsData"
      />
      <KEmptyState
        v-else-if="isLoading && displayMetrics"
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

      <!-- data -->
      <KTable
        v-if="displayDataTable && tableDataIsEmpty === false && tableData"
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
                mesh: row.type === 'Mesh' ? row.name : row.mesh,
                dataplane: row.type === 'Dataplane' ? row.name : null
              }
            }"
          >
            <slot name="tableDataActionsLinkText" />
          </router-link>
        </template>
      </KTable>
      <KEmptyState
        v-if="tableDataIsEmpty === true"
        cta-is-hidden
      >
        <template slot="title">
          <div class="card-icon mb-3">
            <img src="~@/assets/images/icon-empty-table.svg?external">
          </div>
          No Items Found
        </template>
      </KEmptyState>
      <!-- additional page content -->
      <div
        v-if="$slots.content"
        class="data-overview-content mt-6"
      >
        <slot name="content" />
      </div>
    </div>
    <KEmptyState
      v-else
      cta-is-hidden
    >
      <template slot="title">
        <div class="card-icon mb-3">
          <KIcon
            icon="spinner"
            color="rgba(0, 0, 0, 0.1)"
            size="48"
          />
        </div>
        Data Loading...
      </template>
    </KEmptyState>
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
    tableDataIsEmpty: {
      type: Boolean,
      default: false
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

    img, svg {
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
  }
}
</style>
