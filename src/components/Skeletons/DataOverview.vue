<template>
  <div class="data-overview">
    <!-- controls -->
    <div class="data-table-controls mb-2">
      <slot name="additionalControls" />
      <KButton
        v-if="displayRefreshControl"
        class="ml-2"
        appearance="primary"
        size="small"
        :disabled="isLoading"
        @click="$emit('reloadData')"
      >
        <KIcon
          v-if="isLoading"
          icon="spinner"
          color="#fff"
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
      <div
        v-if="displayDataTable && !tableDataIsEmpty && tableData"
        class="data-overview-table"
      >
        <KTable
          class="micro-table"
          :class="{ 'data-table-is-hidden' : tableDataIsEmpty, 'has-border': tableHasBorder }"
          :options="tableDataFiltered"
          has-hover
          @row:click="tableRowHandler"
        >
          <!-- status -->
          <template
            v-if="displayTableDataStatus"
            v-slot:status="{ rowValue }"
          >
            <div
              class="entity-status"
              :class="{ 'is-offline': (rowValue.toLowerCase() === 'offline') }"
            >
              <span class="entity-status__dot" />
              <span class="entity-status__label">{{ rowValue }}</span>
            </div>
          </template>
          <!-- tags -->
          <template
            v-slot:tags="{ rowValue }"
          >
            <span
              v-for="(item, key) in rowValue"
              :key="key"
              class="entity-tags"
              :class="`entity-tags--${key}`"
            >
              <span
                class="entity-tags__label"
                :class="`entity-tags__label--${item.label.toLowerCase()}`"
              >
                {{ item.label }}
              </span>
              <span
                class="entity-tags__value"
                :class="`entity-tags__value--${item.value}`"
              >
                {{ item.value }}
              </span>
            </span>
          </template>

          <template
            slot="actions"
            slot-scope="{ row }"
          >
            <a
              v-if="tableDataFunctionText"
              class="data-table-action-link"
              :class="{ 'is-active': ($store.state.selectedTableRow === row.name) }"
            >
              <span
                v-if="$store.state.selectedTableRow === row.name"
                class="action-link__active-state"
              >
                &#x2713;
                <span class="sr-only">
                  Selected
                </span>
              </span>
              <span
                v-else
                class="action-link__normal-state"
              >
                {{ tableDataFunctionText }}
              </span>
            </a>
          </template>
        </KTable>

        <slot name="pagination" />
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
          <span v-if="emptyState.title">
            {{ emptyState.title }}
          </span>
          <span v-else>
            No Items Found
          </span>
        </template>
        <template
          v-if="emptyState.message"
          slot="message"
        >
          {{ emptyState.message }}
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
    pageSize: {
      type: Number,
      default: 12
    },
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
    tableHasBorder: {
      type: Boolean,
      required: false,
      default: false
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
    },
    tableDataRow: {
      type: String,
      required: false,
      default: 'name'
    },
    tableDataFunctionText: {
      type: String,
      required: false,
      default: null
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
      const newData = { headers, data: [...data] }

      return newData
    }
  },
  methods: {
    tableRowHandler (e, row, type) {
      this.$emit('tableAction', {
        name: row.name,
        mesh: row.mesh
      })
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
  padding: var(--spacing-sm) var(--spacing-sm) 0 var(--spacing-sm);

  // no arrows on buttons
  .k-button:after, button:after {
    display: none !important;
  }
}

.empty-state-wrapper {
  margin-bottom: 2em;
}

.entity-tags {
  display: inline-flex;
  align-items: stretch;
  font-size: 12px;
  background-color: #fff;
  font-family: var(--font-family-mono);

  &:not(:last-of-type) {
    margin-right: 0.5rem;
    margin-bottom: 0.25rem;
  }
}

.entity-tags__label {
  --color: var(--blue-1);

  position: relative;
  background-color: var(--color);
  color: #fff;
  text-transform: uppercase;
  border-radius: 5px 0 0 5px;
  padding: 0.15rem 0.5rem;
  // box-shadow: inset 0 0 0 1px var(--color);
  box-shadow: inset 0 0 0 1px var(--color);
}

.entity-tags__label--service,
.entity-tags__label--protocol {
  --color: var(--brand-color-6);

  background-color: var(--color);
  box-shadow: inset 0 0 0 1px var(--color);
}

.entity-tags__value {
  background-color: #fff;
  border-radius: 0 5px 5px 0;
  padding: 0.15rem 0.5rem 0.15rem 0.75rem;
  color: #000;
  font-weight: 500;
  box-shadow: inset 0 0 0 1px #ccc;
  // box-shadow: inset 0 0 0 1px currentColor;
}

.data-overview-table {

}

.micro-table.micro-table {
  --dp-table-font-size: 14px;
  --dp-table-padding: 10px;

  th, td {
    padding: var(--dp-table-padding);
  }
}

.k-table {
  font-size: var(--dp-table-font-size);

  tr {
    cursor: pointer;

    td:first-of-type {
      // width: 5%;
      // text-align: center;
    }
  }

  th {
    background-color: var(--gray-7);
  }

  thead {
    border-top: 0 !important;
    border-bottom-width: 1px !important;
  }

  &.has-border {
    border: 1px solid var(--gray-4);
    border-bottom: 0;
  }

  .data-table-action-link {
    display: block;
    padding: var(--spacing-sm);
    cursor: pointer;
    overflow: hidden;
    padding: 0;

    &.is-active {

    }
  }

  .action-link__active-state {
    --size: 18px;

    display: block;
    width: var(--size);
    height: var(--size);
    line-height: var(--size);
    border-radius: 50%;
    background-color: var(--logo-green);
    // margin: 0 auto;
    margin: 0 0 0 5px;
    color: #fff;
    font-size: 13px;
    text-align: center;

    &:before {
      display: block;
    }
  }

}
</style>
