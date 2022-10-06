<template>
  <div class="data-planes-container">
    <div class="data-planes-content component-frame">
      <DataOverview
        :selected-entity-name="dataPlaneOverview?.name"
        :page-size="pageSize"
        :has-error="hasError"
        :is-loading="isLoading"
        :empty-state="getEmptyState()"
        :table-data="filteredTableData"
        :table-data-is-empty="tableDataIsEmpty"
        show-details
        :next="next"
        :page-offset="pageOffset"
        @table-action="($event) => selectDataPlaneOverview($event.name)"
        @load-data="loadData($event)"
      >
        <template #additionalControls>
          <div>
            <label
              for="data-planes-type-filter"
              class="mr-2"
            >
              Type:
            </label>

            <select
              id="data-planes-type-filter"
              v-model="filteredDataPlaneType"
              data-testid="data-planes-type-filter"
            >
              <option
                v-for="(dataPlaneType, key) in $options.dataPlaneTypes"
                :key="key"
                :value="dataPlaneType"
              >
                {{ dataPlaneType }}
              </option>
            </select>
          </div>

          <KDropdownMenu
            label="Columns"
            icon="cogwheel"
            button-appearance="outline"
          >
            <template #items>
              <div @click="stopPropagatingClickEvent">
                <KDropdownItem
                  v-for="(item, index) in columnsDropdownItems"
                  :key="index"
                  class="table-header-selector-item"
                  :item="item"
                >
                  <label
                    :for="`data-plane-table-header-checkbox-${index}`"
                    class="k-checkbox table-header-selector-item-checkbox"
                  >
                    <input
                      :id="`data-plane-table-header-checkbox-${index}`"
                      :checked="item.isChecked"
                      type="checkbox"
                      class="k-input"
                      @change="(event) => updateVisibleTableHeaders(event, item.tableHeaderKey)"
                    >

                    {{ item.label }}
                  </label>
                </KDropdownItem>
              </div>
            </template>
          </KDropdownMenu>

          <KButton
            class="add-dp-button"
            appearance="primary"
            :to="dataplaneWizardRoute"
            data-testid="data-plane-create-data-plane-button"
            @click="onCreateClick"
          >
            <span class="custom-control-icon">
              +
            </span>

            Create data plane proxy
          </KButton>

          <KButton
            v-if="$route.query.ns"
            appearance="primary"
            :to="$options.nsBackButtonRoute"
            data-testid="data-plane-ns-back-button"
          >
            <span class="custom-control-icon">
              ←
            </span>

            View All
          </KButton>
        </template>
      </DataOverview>
    </div>

    <div class="data-planes-sidebar component-frame">
      <DataPlaneEntitySummary
        v-if="dataPlaneOverview !== null"
        :data-plane-overview="dataPlaneOverview"
      />

      <EmptyBlock v-else />
    </div>
  </div>
</template>

<script>
/** @typedef {import('../constants').ColumnDropdownItem} ColumnDropdownItem */
/** @typedef {import('@/types').DataplaneOverview} DataplaneOverview */
/** @typedef {import('@/types').ZoneOverview} ZoneOverview */

import { mapGetters } from 'vuex'
import { datadogLogs } from '@datadog/browser-logs'
import { KButton, KDropdownItem, KDropdownMenu } from '@kong/kongponents'

import { columnsDropdownItems, defaultVisibleTableHeaderKeys, getDataPlaneTableHeaders } from '../constants'
import { Storage } from '@/utils/Storage'
import { patchQueryParam } from '@/utils/patchQueryParam'
import Kuma from '@/services/kuma'
import { humanReadableDate } from '@/helpers'
import { datadogLogEvents } from '@/datadogEvents'
import {
  checkKumaDpAndZoneVersionsMismatch,
  compatibilityKind,
  dpTags,
  getDataplaneType,
  getStatus,
  COMPATIBLE,
  INCOMPATIBLE_UNSUPPORTED_ENVOY,
  INCOMPATIBLE_UNSUPPORTED_KUMA_DP,
  INCOMPATIBLE_ZONE_CP_AND_KUMA_DP_VERSIONS,
} from '@/dataplane'
import { PRODUCT_NAME, KUMA_ZONE_TAG_NAME } from '@/consts'
import { getTableData } from '@/utils/tableDataUtils'
import DataOverview from '@/components/Skeletons/DataOverview.vue'
import DataPlaneEntitySummary from '@/data-planes/components/DataPlaneEntitySummary.vue'
import EmptyBlock from '@/components/EmptyBlock.vue'

export default {
  name: 'DataPlaneListView',

  dataPlaneTypes: [
    'All',
    'Standard',
    'Gateway (builtin)',
    'Gateway (provided)',
  ],
  emptyStateMsg: 'There are no data plane proxies present.',
  nsBackButtonRoute: { name: 'data-plane-list-view' },
  dataplaneApiParams: {},

  components: {
    DataOverview,
    DataPlaneEntitySummary,
    KButton,
    KDropdownItem,
    KDropdownMenu,
    EmptyBlock,
  },

  props: {
    name: {
      type: String,
      required: false,
      default: null,
    },

    offset: {
      type: Number,
      required: false,
      default: 0,
    },
  },

  data() {
    return {
      visibleTableHeaderKeys: defaultVisibleTableHeaderKeys,
      productName: PRODUCT_NAME,
      isLoading: true,
      isEmpty: false,
      hasError: false,
      tableDataIsEmpty: false,
      tableData: {
        headers: [],
        data: [],
      },
      pageSize: 50,
      next: null,
      shownTLSTab: false,
      rawData: null,
      filteredDataPlaneType: 'All',
      pageOffset: this.offset,
      dataPlaneOverview: null,
    }
  },

  computed: {
    ...mapGetters({
      environment: 'config/getEnvironment',
      queryNamespace: 'getItemQueryNamespace',
      multicluster: 'config/getMulticlusterStatus',
    }),

    dataplaneWizardRoute() {
      // we change the route to the Dataplane
      // wizard based on environment.
      if (this.environment === 'universal') {
        return { name: 'universal-dataplane' }
      } else {
        return { name: 'kubernetes-dataplane' }
      }
    },

    filteredTableData() {
      const data = this.tableData.data.filter((row) => {
        if (this.filteredDataPlaneType === 'All') {
          return true
        } else {
          return row.type.toLowerCase() === this.filteredDataPlaneType.toLowerCase()
        }
      })
      const headers = getDataPlaneTableHeaders(this.multicluster, this.visibleTableHeaderKeys)

      return {
        data,
        headers,
      }
    },

    /**
     * @returns {ColumnDropdownItem[]}
     */
    columnsDropdownItems() {
      return columnsDropdownItems
        .filter((item) => this.multicluster ? true : item.tableHeaderKey !== 'zone')
        .map((item) => {
          const isChecked = this.visibleTableHeaderKeys.includes(item.tableHeaderKey)

          return {
            ...item,
            isChecked,
          }
        })
    },
  },

  watch: {
    '$route.params.mesh': function () {
      // Don’t trigger a load when the user is navigating to another route.
      if (this.$route.name !== 'data-plane-list-view') {
        return
      }

      // Ensures basic state is reset when switching meshes using the mesh selector.
      this.isLoading = true
      this.isEmpty = false
      this.hasError = false
      this.tableDataIsEmpty = false

      this.loadData(0)
    },
  },

  created() {
    const visibleTableHeaderKeys = Storage.get('dpVisibleTableHeaderKeys')
    if (Array.isArray(visibleTableHeaderKeys)) {
      this.visibleTableHeaderKeys = visibleTableHeaderKeys
    }
  },

  beforeMount() {
    this.loadData(this.offset)
  },

  methods: {
    /**
     * Ensures that the dropdown menu isn’t toggled whenever a checkbox is checked/unchecked.
     *
     * @param {Event} event
     */
    stopPropagatingClickEvent(event) {
      event.stopPropagation()
    },

    /**
     * @param {Event} event
     * @param {string} tableHeaderKey
     */
    updateVisibleTableHeaders(event, tableHeaderKey) {
      const input = /** @type {HTMLInputElement} */ (event.target)
      const index = this.visibleTableHeaderKeys.findIndex((key) => key === tableHeaderKey)

      if (input.checked && index === -1) {
        this.visibleTableHeaderKeys.push(tableHeaderKey)
      } else if (!input.checked && index > -1) {
        this.visibleTableHeaderKeys.splice(index, 1)
      }

      Storage.set('dpVisibleTableHeaderKeys', Array.from(new Set(this.visibleTableHeaderKeys)))
    },

    onCreateClick() {
      datadogLogs.logger.info(datadogLogEvents.CREATE_DATA_PLANE_PROXY_CLICKED)
    },

    getEmptyState() {
      return {
        title: 'No Data',
        message: this.$options.emptyStateMsg,
      }
    },

    /**
     * @param {DataplaneOverview} response
     * @param {ZoneOverview[]} zoneOverviews
     */
    parseData(response, zoneOverviews = []) {
      const { dataplane = {}, dataplaneInsight = {} } = response
      const { name = '', mesh = '' } = response
      const { subscriptions = [] } = dataplaneInsight

      const nameRoute = {
        name: 'data-plane-detail-view',
        params: {
          mesh,
          dataPlane: name,
        },
      }
      const meshRoute = {
        name: 'mesh-child',
        params: {
          mesh,
        },
      }

      /**
       * Handle our tag collections based on the dataplane type.
       */
      const importantDataPlaneTagLabels = [
        'kuma.io/protocol',
        'kuma.io/service',
        'kuma.io/zone',
      ]
      const tags = dpTags(dataplane).filter((tag) => importantDataPlaneTagLabels.includes(tag.label))
      const service = tags.find((tag) => tag.label === 'kuma.io/service')?.value
      const protocol = tags.find((tag) => tag.label === 'kuma.io/protocol')?.value
      const zone = tags.find((tag) => tag.label === 'kuma.io/zone')?.value

      let serviceInsightRoute
      if (service !== undefined) {
        serviceInsightRoute = {
          name: 'service-insight-detail-view',
          params: {
            mesh,
            service,
          },
        }
      }

      const { status } = getStatus(dataplane, dataplaneInsight)

      /**
       * Iterate through the subscriptions
       */

      const { totalUpdates, totalRejectedUpdates, dpVersion, envoyVersion, selectedTime, selectedUpdateTime, version } =
        subscriptions.reduce(
          (acc, curr) => {
            const { status = {}, connectTime, version = {} } = curr
            const { total = {}, lastUpdateTime } = status
            const { responsesSent = '0', responsesRejected = '0' } = total
            const { kumaDp = {}, envoy = {} } = version
            const { version: dpVersion } = kumaDp
            const { version: envoyVersion } = envoy

            let { selectedTime, selectedUpdateTime } = acc

            const connectDate = Date.parse(connectTime)
            const lastUpdateDate = Date.parse(lastUpdateTime)

            if (connectDate) {
              if (!selectedTime || connectDate > selectedTime) {
                selectedTime = connectDate
              }
            }

            if (lastUpdateDate) {
              if (!selectedUpdateTime || lastUpdateDate > selectedUpdateTime) {
                selectedUpdateTime = lastUpdateDate
              }
            }

            return {
              totalUpdates: acc.totalUpdates + parseInt(responsesSent, 10),
              totalRejectedUpdates: acc.totalRejectedUpdates + parseInt(responsesRejected, 10),
              dpVersion: dpVersion || acc.dpVersion,
              envoyVersion: envoyVersion || acc.envoyVersion,
              selectedTime,
              selectedUpdateTime,
              version: version || acc.version,
            }
          },
          {
            totalUpdates: 0,
            totalRejectedUpdates: 0,
            dpVersion: '—',
            envoyVersion: '—',
            selectedTime: NaN,
            selectedUpdateTime: NaN,
            version: {},
          },
        )

      // assemble the table data
      const item = {
        name,
        nameRoute,
        mesh,
        meshRoute,
        zone: zone ?? '—',
        service: service ?? '—',
        serviceInsightRoute,
        protocol: protocol ?? '—',
        status,
        totalUpdates,
        totalRejectedUpdates,
        dpVersion,
        envoyVersion,
        warnings: [],
        unsupportedEnvoyVersion: false,
        unsupportedKumaDPVersion: false,
        kumaDpAndKumaCpMismatch: false,
        lastUpdated: selectedUpdateTime ? humanReadableDate(new Date(selectedUpdateTime).toUTCString()) : '—',
        lastConnected: selectedTime ? humanReadableDate(new Date(selectedTime).toUTCString()) : '—',
        type: getDataplaneType(dataplane),
      }

      const { kind } = compatibilityKind(version)

      if (kind !== COMPATIBLE) {
        item.warnings.push(kind)
      }

      switch (kind) {
        case INCOMPATIBLE_UNSUPPORTED_ENVOY:
          item.unsupportedEnvoyVersion = true
          break
        case INCOMPATIBLE_UNSUPPORTED_KUMA_DP:
          item.unsupportedKumaDPVersion = true
          break
      }

      if (this.multicluster) {
        const zoneTag = tags.find(tag => tag.label === KUMA_ZONE_TAG_NAME)

        if (zoneTag) {
          const zoneOverview = zoneOverviews.find((zoneOverview) => zoneOverview.name === zoneTag.value)

          if (zoneOverview) {
            const { compatible } = checkKumaDpAndZoneVersionsMismatch(dpVersion, zoneOverview)

            if (!compatible) {
              item.warnings.push(INCOMPATIBLE_ZONE_CP_AND_KUMA_DP_VERSIONS)
              item.kumaDpAndKumaCpMismatch = true
            }
          }
        }
      }

      return item
    },

    /**
     * @param {number} offset
     */
    async loadData(offset) {
      this.isLoading = true

      this.pageOffset = offset

      // Puts the offset parameter in the URL so it can be retrieved when the user reloads the page.
      patchQueryParam('offset', offset > 0 ? offset : null)

      const mesh = this.$route.params.mesh || null
      const query = this.$route.query.ns || null

      try {
        const { data, next } = await getTableData({
          getSingleEntity: Kuma.getDataplaneOverviewFromMesh.bind(Kuma),
          getAllEntities: Kuma.getAllDataplaneOverviews.bind(Kuma),
          getAllEntitiesFromMesh: Kuma.getAllDataplaneOverviewsFromMesh.bind(Kuma),
          size: this.pageSize,
          offset,
          mesh,
          query,
          params: { ...this.$options.dataplaneApiParams },
        })

        if (data.length > 0) {
          this.next = next
          this.rawData = data
          this.selectDataPlaneOverview(this.name ?? data[0].name)

          const { items: zoneOverviews } = await Kuma.getAllZoneOverviews()
          const final = await Promise.all(data.map((item) => this.parseData(item, zoneOverviews)))

          this.tableData.data = final
          this.tableDataIsEmpty = false
          this.isEmpty = false
        } else {
          this.selectDataPlaneOverview(null)
          this.tableData.data = []
          this.tableDataIsEmpty = true
          this.isEmpty = true
        }
      } catch (e) {
        this.hasError = true
        this.isEmpty = true

        console.error(e)
      } finally {
        this.isLoading = false
      }
    },

    async selectDataPlaneOverview(name) {
      if (name) {
        this.dataPlaneOverview = this.rawData.find((data) => data.name === name) ?? this.rawData[0]
        patchQueryParam('name', this.dataPlaneOverview.name)
      } else {
        this.dataPlaneOverview = null
        patchQueryParam('name', null)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.data-planes-container {
  display: flex;
  // Allows the contained flex items to wrap when their size needs can’t be satisfied any longer.
  flex-wrap: wrap;
  align-items: flex-start;
  gap: var(--spacing-lg);
}

.data-planes-content {
  flex-basis: 0;
  flex-grow: 999;
  // Sets the minimum size of the content element. Effectively, this behaves as a trigger for the flex items to wrap. Once this element can would take up less space that this size, the items will wrap because this element’s sizing requirements are no longer met.
  min-inline-size: 66.666%;
}

.data-planes-sidebar {
  // Ensures this element always takes up a minimum size but never more than 100%.
  flex-basis: min(60ch, 100%);
  // Let’s the element take up all available space. Applies when the content and the sidebar wrap.
  flex-grow: 1;
  min-inline-size: 0;
  background-color: var(--white);

  @media (min-width: 1600px) {
    // Makes sidebar stick to the viewport while taking into account the height of the fixed top bar.
    position: sticky;
    top: calc(var(--topbar-height) + var(--spacing-lg));
    bottom: var(--spacing-lg);
  }
}

.add-dp-button.add-dp-button {
  background-color: var(--logo-green);
}

.table-header-selector-item-checkbox {
  padding: var(--spacing-md) var(--spacing-lg);
  display: flex;
  align-items: center;
}
</style>

<style lang="scss">
.table-header-selector-item .k-dropdown-item-trigger {
  padding: 0 !important;
}
</style>
