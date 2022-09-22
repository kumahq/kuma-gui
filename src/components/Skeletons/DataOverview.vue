<template>
  <div
    class="data-overview"
    data-testid="data-overview"
  >
    <div class="data-table-controls mb-2">
      <slot name="additionalControls" />

      <KButton
        class="refresh-button"
        appearance="primary"
        :disabled="isLoading"
        @click="onRefreshButtonClick"
      >
        <span
          class="refresh-icon custom-control-icon"
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
        </span>
        <span>Refresh</span>
      </KButton>
    </div>

    <LoadingBlock v-if="isLoading" />

    <ErrorBlock
      v-else-if="hasError"
      :error="error"
    />

    <EmptyBlock v-else-if="isEmpty" />

    <div
      v-else
      class="data-overview-content"
    >
      <!-- data -->
      <div
        v-if="!tableDataIsEmpty && tableData"
        class="data-overview-table"
      >
        <KTable
          :key="tableRecompuationKey"
          :class="{ 'data-table-is-hidden' : tableDataIsEmpty }"
          :fetcher="tableDataFetcher"
          :headers="tableHeaders"
          :cell-attrs="getCellAttributes"
          :row-attrs="getRowAttributes"
          disable-pagination
          is-clickable
          data-testid="data-overview-table"
          @row:click="tableRowHandler"
        >
          <!-- Custom slots provided by parent -->
          <template
            v-for="slot in customSlots"
            #[slot]="{ rowValue, row }"
          >
            <slot
              :name="slot"
              :row-value="rowValue"
              :row="row"
            />
          </template>

          <!-- status -->
          <template #status="{ rowValue }">
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

          <template #name="{ row, rowValue }">
            <KButton
              v-if="row.nameRoute"
              appearance="btn-link"
              :to="row.nameRoute"
            >
              {{ rowValue }}
            </KButton>

            <template v-else>
              {{ rowValue }}
            </template>
          </template>

          <template #mesh="{ row, rowValue }">
            <KButton
              v-if="row.meshRoute"
              appearance="btn-link"
              :to="row.meshRoute"
            >
              {{ rowValue }}
            </KButton>

            <template v-else>
              {{ rowValue }}
            </template>
          </template>

          <!--- total Updates --->
          <template #totalUpdates="{ row }">
            <span>
              {{ row.totalUpdates }}
            </span>
          </template>

          <template #selected="{row}">
            <a
              class="data-table-action-link"
              :class="{ 'is-active': selectedRow === row.name }"
            >
              <span
                v-if="selectedRow === row.name"
                class="action-link__active-state"
              >
                ✓

                <span class="sr-only">Selected</span>
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
          <template #dpVersion="{ row, rowValue }">
            <div
              :class="{
                'with-warnings': row.unsupportedEnvoyVersion || row.unsupportedKumaDPVersion || row.kumaDpAndKumaCpMismatch,
              }"
            >
              {{ rowValue }}
            </div>
          </template>

          <!--- envoy Version --->
          <template #envoyVersion="{ row, rowValue }">
            <div
              :class="{
                'with-warnings': row.unsupportedEnvoyVersion,
              }"
            >
              {{ rowValue }}
            </div>
          </template>

          <!--- warnings --->
          <template
            v-if="showWarnings"
            #warnings="{ row }"
          >
            <KIcon
              v-if="row.withWarnings"
              class="mr-1"
              icon="warning"
              color="var(--black-75)"
              secondary-color="var(--yellow-300)"
              size="20"
            />
          </template>

          <template
            v-if="showDetails"
            #details="{ row }"
          >
            <KButton
              class="detail-link"
              appearance="btn-link"
              :to="row.nameRoute"
            >
              <template #icon>
                <KIcon
                  :icon="row.warnings.length > 0 ? 'warning' : 'info'"
                  :color="row.warnings.length > 0 ? 'var(--black-75)' : 'var(--blue-500)'"
                  :secondary-color="row.warnings.length > 0 ? 'var(--yellow-300)' : null"
                  size="20"
                />
              </template>
              Details
            </KButton>
          </template>
        </KTable>

        <PaginationWidget
          :has-previous="internalPageOffset > 0"
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
        <template #title>
          <div class="card-icon mb-3">
            <img src="@/assets/images/icon-empty-table.svg?url">
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
          #message
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
  </div>
</template>

<script>
import { KButton, KEmptyState, KIcon, KTable } from '@kong/kongponents'
import { datadogLogs } from '@datadog/browser-logs'

import { datadogLogEvents } from '@/datadogEvents'
import PaginationWidget from '@/components/PaginationWidget.vue'
import EmptyBlock from '@/components/EmptyBlock.vue'
import ErrorBlock from '@/components/ErrorBlock.vue'
import LoadingBlock from '@/components/LoadingBlock.vue'

export default {
  name: 'DataOverview',

  components: {
    PaginationWidget,
    EmptyBlock,
    ErrorBlock,
    LoadingBlock,
    KButton,
    KEmptyState,
    KIcon,
    KTable,
  },

  props: {
    selectedEntityName: {
      type: String,
      required: false,
      default: '',
    },

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

    error: {
      type: Object,
      required: false,
      default: null,
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

    tableDataIsEmpty: {
      type: Boolean,
      default: false,
    },

    showWarnings: {
      type: Boolean,
      required: false,
      default: false,
    },

    showDetails: {
      type: Boolean,
      required: false,
      default: false,
    },

    next: {
      type: Boolean,
      default: false,
    },

    pageOffset: {
      type: Number,
      required: false,
      default: 0,
    },
  },

  emits: ['table-action', 'refresh', 'load-data'],

  data() {
    return {
      selectedRow: '',
      internalPageOffset: 0,
    }
  },

  computed: {
    customSlots() {
      return this.tableData.headers
        .map(({ key }) => key)
        .filter((key) => this.$slots[key])
    },

    tableHeaders() {
      if (!this.showWarnings) {
        return this.tableData.headers.filter(({ key }) => key !== 'warnings')
      } else {
        return this.tableData.headers
      }
    },

    /**
     * Just changing the table data/headers doesn’t cause the table component to re-render, so by updating its `key` prop when this happens, we force a re-render. This is necessary to get the column visibility toggles and similar operations to work in the data planes list view.
     *
     * @returns {string}
     */
    tableRecompuationKey() {
      return `${this.tableData.data.length}-${this.tableHeaders.length}`
    },
  },

  watch: {
    isLoading(val) {
      if (!val && this.tableData.data.length > 0) {
        this.selectedRow = this.selectedEntityName || this.tableData.data[0].name
      }
    },
  },

  created() {
    this.internalPageOffset = this.pageOffset
  },

  methods: {
    /**
     * @returns {{ data: object[], total: number }}
     */
    tableDataFetcher() {
      return {
        data: this.tableData.data,
        total: this.tableData.data.length,
      }
    },

    tableRowHandler(_e, row) {
      this.selectedRow = row.name
      this.$emit('table-action', row)
    },

    onRefreshButtonClick() {
      this.$emit('refresh')
      this.$emit('load-data', this.internalPageOffset)
      datadogLogs.logger.info(datadogLogEvents.TABLE_REFRESH_BUTTON_CLICKED)
    },

    goToPreviousPage() {
      this.internalPageOffset = this.pageOffset - this.pageSize
      this.$emit('load-data', this.pageOffset - this.pageSize)
    },

    goToNextPage() {
      this.internalPageOffset = this.pageOffset + this.pageSize
      this.$emit('load-data', this.pageOffset + this.pageSize)
    },

    getCellAttributes({ headerKey }) {
      const className = ['warnings'].includes(headerKey) ? 'text-center' : ['details'].includes(headerKey) ? 'text-right' : ''

      return { class: className }
    },

    getRowAttributes({ name }) {
      const entityName = this.selectedEntityName || this.tableData.data[0].name
      const className = name === entityName ? 'is-selected' : ''

      return { class: className }
    },
  },
}
</script>

<style lang="scss" scoped>
.refresh-icon {
  &.is-spinning g {
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
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-sm) 0 var(--spacing-sm);
}

.with-warnings {
  color: var(--yellow-500);
}

.entity-tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xxs);
}

.data-table-action-link {
  padding: 0;
}

.action-link__active-state {
  --size: 18px;

  display: block;
  width: var(--size);
  height: var(--size);
  line-height: var(--size);
  border-radius: 50%;
  background-color: var(--logo-green);
  margin: 0 0 0 var(--spacing-xxs);
  color: #fff;
  font-size: 13px;
  text-align: center;
}
</style>

<style lang="scss">
.k-table {
  tr.is-selected {
    background-color: var(--grey-100);
  }

  th {
    background-color: var(--gray-7);
  }
}
</style>
