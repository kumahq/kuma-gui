<template>
  <div
    class="data-overview"
    data-testid="data-overview"
  >
    <!-- controls -->
    <div class="data-table-controls mb-2">
      <slot name="additionalControls" />
      <KButton
        class="ml-2 refresh-button"
        appearance="primary"
        size="small"
        :disabled="isLoading"
        @click="onRefreshButtonClick"
      >
        <div
          class="refresh-icon"
          :class="{ 'is-spinning': isLoading }"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 36 36"
          >
            <g
              fill="#fff"
              fill-rule="nonzero"
            >
              <path d="M18 5.5a12.465 12.465 0 00-8.118 2.995 1.5 1.5 0 001.847 2.363l.115-.095A9.437 9.437 0 0118 8.5l.272.004a9.487 9.487 0 019.07 7.75l.04.246H25a.5.5 0 00-.416.777l4 6a.5.5 0 00.832 0l4-6 .04-.072A.5.5 0 0033 16.5h-2.601l-.017-.15C29.567 10.2 24.294 5.5 18 5.5zM2.584 18.723l-.04.072A.5.5 0 003 19.5h2.6l.018.15C6.433 25.8 11.706 30.5 18 30.5c3.013 0 5.873-1.076 8.118-2.995a1.5 1.5 0 00-1.847-2.363l-.115.095A9.437 9.437 0 0118 27.5l-.272-.004a9.487 9.487 0 01-9.07-7.75l-.041-.246H11a.5.5 0 00.416-.777l-4-6a.5.5 0 00-.832 0l-4 6z" />
            </g>
          </svg>
        </div>
        <span>Refresh</span>
      </KButton>
    </div>

    <div
      v-if="isReady"
      class="data-overview-content"
    >
      <!-- data -->
      <div
        v-if="!tableDataIsEmpty && tableData"
        class="data-overview-table"
      >
        <KTable
          class="micro-table"
          :class="{ 'data-table-is-hidden' : tableDataIsEmpty, 'has-border': tableHasBorder }"
          :options="tableDataFiltered"
          :has-side-border="false"
          has-hover
          is-clickable
          @row:click="tableRowHandler"
        >
          <!-- status -->
          <template v-slot:status="{ rowValue }">
            <div
              class="entity-status"
              :class="{
                'is-offline': (rowValue.toString().toLowerCase() === 'offline' || rowValue === false),
                'is-degraded': (rowValue.toString().toLowerCase() === 'partially degraded' || rowValue === false)
              }"
            >
              <span class="entity-status__dot" />
              <span class="entity-status__label">{{ rowValue }}</span>
            </div>
          </template>
          <!-- tags -->
          <template v-slot:tags="{ rowValue }">
            <EntityTag
              v-for="(tag, key) in rowValue"
              :key="key"
              :tag="tag"
            />
          </template>
          <!--- total Updates --->
          <template v-slot:totalUpdates="{ row }">
            <span class="entity-total-updates">
              <span>
                {{ row.totalUpdates }}
              </span>
            </span>
          </template>
          <!--- actions --->
          <template v-slot:actions="{row}">
            <a
              class="data-table-action-link"
              :class="{ 'is-active': (selectedRow=== row.name) }"
            >
              <span
                v-if="selectedRow === row.name"
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
                View
              </span>
            </a>
          </template>
          <!--- dp Version --->
          <template v-slot:dpVersion="{ row, rowValue }">
            <div :class="{
                'with-warnings': row.unsupportedEnvoyVersion || row.unsupportedKumaDPVersion || row.kumaDpAndKumaCpMismatch,
              }">
              {{ rowValue }}
            </div>
          </template>
          <!--- envoy Version --->
          <template v-slot:envoyVersion="{ row, rowValue }">
            <div :class="{
                'with-warnings': row.unsupportedEnvoyVersion,
              }">
              {{ rowValue }}
            </div>
          </template>
          <!--- warnings --->
          <template
            v-if="showWarnings"
            v-slot:warnings="{ row }"
          >
            <KIcon
              v-if="row.withWarnings"
              class="mr-1"
              color="var(--yellow-400)"
              icon="warning"
              secondary-color="var(--black-75)"
              size="20"
            />
            <div v-else />
          </template>
        </KTable>

        <Pagination
          :has-previous="pageOffset > 0"
          :has-next="next"
          @next="goToNextPage"
          @previous="goToPreviousPage"
        />
      </div>

      <!-- empty state if no items are found -->
      <KEmptyState
        v-if="tableDataIsEmpty && tableData"
        cta-is-hidden
      >
        <template v-slot:title>
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
          v-slot:message
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
      <template v-slot:title>
        <div class="card-icon mb-3">
          <KIcon
            icon="spinner"
            color="rgba(0, 0, 0, 0.25)"
            size="42"
          />
        </div>
        Data Loading&hellip;
      </template>
    </KEmptyState>

    <!-- error has occurred -->
    <KEmptyState
      v-if="hasError"
      cta-is-hidden
    >
      <template v-slot:title>
        <div class="card-icon mb-3">
          <KIcon
            class="kong-icon--centered"
            color="var(--yellow-200)"
            icon="warning"
            secondary-color="var(--black-75)"
            size="42"
          />
        </div>
        An error has occurred while trying to load this data.
      </template>
    </KEmptyState>
  </div>
</template>

<script>
import { datadogLogs } from '@datadog/browser-logs'
import { datadogLogEvents } from '@/datadogEvents'
import Pagination from '@/components/Pagination'
import EntityTag from '@/components/EntityTag/EntityTag.vue'

export default {
  name: 'DataOverview',
  components: {
    Pagination,
    EntityTag,
  },
  props: {
    pageSize: {
      type: Number,
      default: 12,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    hasError: {
      type: Boolean,
      default: false,
    },
    isEmpty: {
      type: Boolean,
      default: false,
    },
    emptyState: {
      type: Object,
      default: null,
    },
    tableData: {
      type: Object,
      default: null,
    },
    tableHasBorder: {
      type: Boolean,
      required: false,
      default: false,
    },
    tableDataIsEmpty: {
      type: Boolean,
      default: false,
    },
    showWarnings: {
      type: Boolean,
    },
    next: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedRow: '',
      pageOffset: 0,
    }
  },
  computed: {
    isReady() {
      return !this.isEmpty && !this.hasError && !this.isLoading
    },
    tableDataFiltered() {
      const data = this.tableData.data
      const headers = this.tableData.headers
      const newData = { headers, data: [...data] }

      if (!this.showWarnings) {
        newData.headers = newData.headers.filter(({ key }) => key !== 'warnings')
      }

      return newData
    },
  },
  watch: {
    isLoading(val) {
      if (!val && this.tableData.data.length > 0) {
        this.selectedRow = this.tableData.data[0].name
      }
    },
  },
  methods: {
    tableRowHandler(e, row, type) {
      this.selectedRow = row.name
      this.$emit('tableAction', row)
    },
    onRefreshButtonClick() {
      this.$emit('refresh')
      this.$emit('loadData', this.pageOffset)
      datadogLogs.logger.info(datadogLogEvents.TABLE_REFRESH_BUTTON_CLICKED)
    },
    goToPreviousPage() {
      this.pageOffset -= this.pageSize

      this.$emit('loadData', this.pageOffset)
    },
    goToNextPage() {
      this.pageOffset += this.pageSize

      this.$emit('loadData', this.pageOffset)
    },
  },
}
</script>

<style lang="scss">
.empty-state-title {
  .card-icon {
    text-align: center;

    img,
    svg {
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
  }
}

.refresh-button {
  max-height: 27px;
}

.refresh-icon {
  --i: 18px;
  width: var(--i);
  height: var(--i);
  margin-right: 5px;

  svg {
    display: block;

    g {
      transform-box: fill-box;
      transform-origin: 50% 50%;
    }
  }

  &.is-spinning svg g {
    animation: spin 1.2s infinite linear;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(1turn);
    }
  }
}

.data-table-controls {
  text-align: right;
  padding: var(--spacing-sm) var(--spacing-sm) 0 var(--spacing-sm);
}

.data-overview-table {
  // this accounts for super long table widths
  overflow-x: auto;

  @media (max-width: 1110px) {
    overflow-x: scroll;
    touch-action: pan-x;
  }
}

.micro-table.micro-table {
  --dp-table-font-size: 14px;
  --dp-table-padding: 10px;

  th,
  td {
    padding: var(--dp-table-padding);
  }

  /**
    This fixes an issue where clicking on something inside of a row doesn't trigger the row click event
    This is hacky and not recommended if you have other items inside of your table cells that you
    want to have their own click actions.
   */
  th > *,
  td > * {
    pointer-events: none;
  }
}

.k-table {
  font-size: var(--dp-table-font-size);

  tr {
    cursor: pointer;
  }

  th {
    background-color: var(--gray-7);
  }

  thead {
    border-top: 0 !important;
    border-bottom-width: 1px !important;
  }

  tbody {
    td {
      vertical-align: top;
    }
  }

  &.has-border {
    border: 1px solid var(--gray-4);
    border-bottom: 0;
  }

  .data-table-action-link {
    display: block;
    padding: var(--spacing-sm);
    overflow: hidden;
    padding: 0;
    text-decoration: none !important;
    pointer-events: none;
    color: var(--DataOverviewTableLinkColor) !important;

    &.is-active {
      text-decoration: none !important;
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
    margin: 0 0 0 5px;
    color: #fff;
    font-size: 13px;
    text-align: center;

    &:before {
      display: block;
    }
  }
}

// some reusable styles

.with-warnings {
  color: var(--yellow-400);
}
</style>
