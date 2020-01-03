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
      <div v-if="displayDataTable && !tableDataIsEmpty && tableData">
        <KTable
          :options="tableData"
        >
          <template
            v-if="displayTableDataStatus"
            v-slot:status="{rowValue}"
          >
            <div
              class="entity-status"
              :class="{ 'is-offline': (rowValue === 'Offline' || rowValue === 'offline') }"
            >
              <span class="entity-status__dot" />
              <span class="entity-status__label">{{ rowValue }}</span>
            </div>
          </template>
          <template
            slot="actions"
            slot-scope="{ row }"
          >
            <router-link
              :to="{
                name: tableActionsRouteName,
                params: {
                  // TODO: find a better, more efficient way to handle this
                  mesh: row.type === 'Mesh' || row.type === 'mesh' ? row.name : row.mesh,
                  dataplane: row.type === 'Dataplane' || row.type === 'dataplane' ? row.name : null,
                  trafficpermission: row.type === 'TrafficPermission' || row.type === 'trafficpermission' ? row.name : null,
                  trafficroute: row.type === 'TrafficRoute' || row.type === 'trafficroute' ? row.name : null,
                  trafficlog: row.type === 'TrafficLog' || row.type === 'trafficlog' ? row.name : null,
                  healthcheck: row.type === 'HealthCheck' || row.type === 'healthcheck' ? row.name : null,
                  proxytemplate: row.type === 'ProxyTemplate' || row.type === 'proxytemplate' ? row.name : null,
                  //service: row.type === 'Service' || row.type === 'service' ? row.name : null
                }
              }"
            >
              <slot name="tableDataActionsLinkText" />
            </router-link>
          </template>
        </KTable>

        <!-- <Pagination
          v-if="tableData && tableData.length > itemListPageSize"
          :has-previous="itemsListOffset - itemListPageSize >= 0"
          :has-next="tableData.length - itemsListOffset > itemListPageSize"
          class="ml-2 mr-2 mb-2"
          @next="goToNextPage"
          @previous="goToPreviousPage"
        /> -->
      </div>

      <!-- empty state if no items are found -->
      <KEmptyState
        v-if="tableDataIsEmpty"
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
import Pagination from '@/components/Pagination'

export default {
  name: 'DataOverview',
  components: {
    MetricGrid,
    Pagination
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
    },
    displayTableDataStatus: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      itemListPageSize: 12,
      itemListOffset: 0
    }
  },
  computed: {
    isReady () {
      return !this.isEmpty && !this.hasError && !this.isLoading
    }
  },
  methods: {
    goToNextPage () {

    },

    goToPreviousPage () {

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
