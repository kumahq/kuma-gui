<template>
  <div class="data-overview">
    <!-- controls -->
    <div
      v-if="displayRefreshControl"
      class="data-table-controls mb-2"
    >
      <KButton
        appearance="secondary"
        size="small"
        :disabled="isLoading"
        @click="$emit('reloadData')"
      >
        <KIcon
          v-if="isLoading"
          icon="spinner"
          color="rgba(0, 0, 0, 5)"
          size="48"
        />
        <span>Refresh</span>
      </KButton>
    </div>

    <div
      v-if="isReady"
      class="data-overview-content"
    >
      <!-- metrics -->
      <MetricGrid
        v-if="!isLoading && displayMetrics && metricsData"
        :metrics="metricsData"
      />

      <!-- data -->
      <div v-if="displayDataTable && !tableDataIsEmpty && tableData">
        <KTable
          class="{ 'data-table-is-hidden' : tableDataIsEmpty }"
          :options="tableDataFiltered"
          has-hover
        >
          <template
            v-if="displayTableDataStatus"
            v-slot:status="{rowValue}"
          >
            <div
              class="entity-status"
              :class="{ 'is-offline': (rowValue.toLowerCase() === 'offline') }"
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
                  mesh: row.type.toLowerCase() === 'mesh' ? row.name : row.mesh,
                  dataplane: row.type.toLowerCase() === 'dataplane' ? row.name : null,
                  trafficpermission: row.type.toLowerCase() === 'trafficpermission' ? row.name : null,
                  trafficroute: row.type.toLowerCase() === 'trafficroute' ? row.name : null,
                  trafficlog: row.type.toLowerCase() === 'trafficlog' ? row.name : null,
                  healthcheck: row.type.toLowerCase() === 'healthcheck' ? row.name : null,
                  proxytemplate: row.type.toLowerCase() === 'proxytemplate' ? row.name : null,
                  service: row.type.toLowerCase() === 'service' ? row.name : null
                }
              }"
            >
              <slot name="tableDataActionsLinkText" />
            </router-link>
          </template>
        </KTable>

        <Pagination
          v-if="tableData && tableRowCount > pageSize"
          :has-previous="pageNumber > 0"
          :has-next="pageNumber < pageCount -1"
          class="ml-2 mr-2 mb-2"
          @next="goToNextPage"
          @previous="goToPreviousPage"
        />
      </div>

      <!-- empty state if no items are found -->
      <KEmptyState
        v-if="displayDataTable && tableDataIsEmpty && tableData"
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

    <!-- empty state -->
    <KEmptyState
      v-if="isEmpty"
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
    },
    displayRefreshControl: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      pageSize: 12,
      pageNumber: 0
    }
  },
  computed: {
    isReady () {
      return !this.isEmpty && !this.hasError && !this.isLoading
    },
    tableRowCount () {
      return Object.entries(this.tableData.data).length
    },
    pageCount () {
      const itemCount = Object.entries(this.tableData.data).length
      const pageSize = this.pageSize

      return Math.ceil(itemCount / pageSize)
    },
    tableDataFiltered () {
      const data = this.tableData.data
      const headers = this.tableData.headers
      const start = this.pageNumber * this.pageSize
      const end = start + this.pageSize
      const filtered = data.slice(start, end)
      const newData = { headers, data: [...filtered] }

      return newData
    }
  },
  methods: {
    goToPreviousPage () {
      this.pageNumber--
    },
    goToNextPage () {
      this.pageNumber++
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

.data-table-controls {
  text-align: right;

  button:after {
    display: none;
  }
}

.info-grid {
  flex-wrap: wrap;

  .metric {
    margin-bottom: 16px;
  }
}

.empty-state-wrapper {
  margin-bottom: 2em;
}

@media only screen and (min-width: 841px) {
  .info-grid {

    .metric {
      flex: 1 1 25%;
    }
  }
}
</style>
