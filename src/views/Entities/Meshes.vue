<template>
  <div class="all-meshes">
    <FrameSkeleton>
      <DataOverview
        :page-size="pageSize"
        :has-error="hasError"
        :is-loading="isLoading"
        :empty-state="empty_state"
        :table-data="tableData"
        :table-data-is-empty="tableDataIsEmpty"
        :next="next"
        @tableAction="tableAction"
        @loadData="loadData($event)"
      >
        <template v-slot:additionalControls>
          <KButton
            class="add-mesh-button"
            appearance="primary"
            size="small"
            :to="{ path: '/wizard/mesh' }"
            @click.native="onCreateClick"
          >
            <span class="custom-control-icon">
              +
            </span>
            Create Mesh
          </KButton>
        </template>
      </DataOverview>
      <Tabs
        v-if="isEmpty === false"
        :has-error="hasError"
        :is-loading="isLoading"
        :tabs="tabs"
        initial-tab-override="overview"
      >
        <template v-slot:tabHeader>
          <div>
            <h3>{{ tabGroupTitle }}</h3>
          </div>
          <!-- <div>
            <EntityURLControl :url="shareUrl" />
          </div> -->
        </template>
        <template v-slot:overview>
          <LabelList
            :has-error="entityHasError"
            :is-loading="entityIsLoading"
            :is-empty="entityIsEmpty"
          >
            <div>
              <ul>
                <li
                  v-for="(value, key) in entity.basicData"
                  :key="key"
                >
                  <h4 v-if="key === 'creationTime'">
                    Created
                  </h4>
                  <h4 v-else-if="key === 'modificationTime'">
                    Last Modified
                  </h4>
                  <h4 v-else>
                    {{ key }}
                  </h4>
                  <p v-if="key === 'creationTime' || key === 'modificationTime'">
                    {{ value | readableDate }} <em>({{ value | rawDate }})</em>
                  </p>
                  <p v-else>
                    {{ value }}
                  </p>
                </li>
              </ul>
            </div>
            <div v-if="entity.extendedData && entity.extendedData.length">
              <ul>
                <li
                  v-for="(item, key) in entity.extendedData"
                  :key="key"
                >
                  <h4>{{ item.label }}</h4>
                  <p
                    v-if="item.value"
                    class="label-cols"
                  >
                    <span>
                      {{ item.value.type }}
                    </span>
                    <span>
                      {{ item.value.name }}
                    </span>
                  </p>
                  <KBadge
                    v-else
                    size="small"
                    appearance="danger"
                  >
                    Disabled
                  </KBadge>
                </li>
                <li>
                  <h4>Locality Aware Loadbalancing</h4>
                  <p v-if="entity.localityEnabled">
                    <KBadge
                      size="small"
                      appearance="success"
                    >
                      Enabled
                    </KBadge>
                  </p>
                  <KBadge
                    v-else
                    size="small"
                    appearance="danger"
                  >
                    Disabled
                  </KBadge>
                </li>
              </ul>
            </div>
          </LabelList>
        </template>
        <template v-slot:yaml>
          <YamlView
            :title="entityOverviewTitle"
            :has-error="entityHasError"
            :is-loading="entityIsLoading"
            :is-empty="entityIsEmpty"
            :content="rawEntity"
          />
        </template>
        <template v-slot:resources>
          <LabelList
            :has-error="entityHasError"
            :is-loading="entityIsLoading"
            :is-empty="entityIsEmpty"
          >
            <div
              v-for="i in countCols"
              :key="i"
            >
              <ul>
                <li
                  v-for="(item, key) in counts.slice((i - 1) * itemsPerCol, i * itemsPerCol)"
                  :key="key"
                >
                  <h4>{{ item.title }}</h4>
                  <p>{{ item.value | formatValue }}</p>
                </li>
              </ul>
            </div>
          </LabelList>
        </template>
      </Tabs>
    </FrameSkeleton>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Kuma from '@/services/kuma'
import { getEmptyInsight, getInitialPolicies } from '@/store/reducers/mesh-insights'
import { datadogLogs } from '@datadog/browser-logs'
import { datadogLogEvents } from '@/datadogEvents'
import { getSome, humanReadableDate, rawReadableDate, stripTimes } from '@/helpers'
// import EntityURLControl from '@/components/Utils/EntityURLControl'
import sortEntities from '@/mixins/EntitySorter'
import FrameSkeleton from '@/components/Skeletons/FrameSkeleton'
import DataOverview from '@/components/Skeletons/DataOverview'
import Tabs from '@/components/Utils/Tabs'
import YamlView from '@/components/Skeletons/YamlView'
import LabelList from '@/components/Utils/LabelList'
import { PAGE_SIZE_DEFAULT } from '@/consts'

export default {
  name: 'Meshes',
  metaInfo: {
    title: 'Meshes',
  },
  components: {
    // EntityURLControl,
    FrameSkeleton,
    DataOverview,
    Tabs,
    YamlView,
    LabelList,
  },
  filters: {
    formatValue(value) {
      return value ? value.toLocaleString('en').toString() : 0
    },
    readableDate(value) {
      return humanReadableDate(value)
    },
    rawDate(value) {
      return rawReadableDate(value)
    },
  },
  mixins: [sortEntities],
  data() {
    return {
      isLoading: true,
      isEmpty: false,
      hasError: false,
      entityIsLoading: true,
      entityIsEmpty: false,
      entityHasError: false,
      tableDataIsEmpty: false,
      empty_state: {
        title: 'No Data',
        message: 'There are no Meshes present.',
      },
      tableData: {
        headers: [
          { key: 'actions', hideLabel: true },
          { label: 'Name', key: 'name' },
          { label: 'Type', key: 'type' },
        ],
        data: [],
      },
      tabs: [
        {
          hash: '#overview',
          title: 'Overview',
        },
        {
          hash: '#resources',
          title: 'Resources',
        },
        {
          hash: '#yaml',
          title: 'YAML',
        },
      ],
      entity: [],
      rawEntity: null,
      firstEntity: null,
      pageSize: PAGE_SIZE_DEFAULT,
      next: null,
      tabGroupTitle: null,
      entityOverviewTitle: null,
      itemsPerCol: 3,
      meshInsight: getEmptyInsight(),
    }
  },
  computed: {
    ...mapState({
      mesh: 'selectedMesh',
    }),
    counts() {
      const {
        policies,
        dataplanes: { total },
      } = this.meshInsight

      const allPolicies = {
        ...getInitialPolicies(),
        ...policies,
      }

      return [
        {
          title: 'Data plane proxies',
          value: total,
        },
        {
          title: 'Circuit Breakers',
          value: allPolicies.CircuitBreaker.total,
        },
        {
          title: 'Fault Injections',
          value: allPolicies.FaultInjection.total,
        },
        {
          title: 'Health Checks',
          value: allPolicies.HealthCheck.total,
        },
        {
          title: 'Proxy Templates',
          value: allPolicies.ProxyTemplate.total,
        },
        {
          title: 'Traffic Logs',
          value: allPolicies.TrafficLog.total,
        },
        {
          title: 'Traffic Permissions',
          value: allPolicies.TrafficPermission.total,
        },
        {
          title: 'Traffic Routes',
          value: allPolicies.TrafficRoute.total,
        },
        {
          title: 'Traffic Traces',
          value: allPolicies.TrafficTrace.total,
        },
        {
          title: 'Rate Limits',
          value: allPolicies.RateLimit.total,
        },
        {
          title: 'Retries',
          value: allPolicies.Retry.total,
        },
        {
          title: 'Timeouts',
          value: allPolicies.Timeout.total,
        },
      ]
    },
    countCols() {
      return Math.ceil(this.counts.length / this.itemsPerCol)
    },
    shareUrl() {
      const urlRoot = `${window.location.origin}/#`

      const shareUrl = () => {
        if (this.$route.query.ns) {
          return this.$route.fullPath
        }

        return `${urlRoot}${this.$route.fullPath}`
      }

      return shareUrl()
    },
  },
  watch: {
    $route(to, from) {
      this.init()
    },
  },
  beforeMount() {
    this.init()
  },
  methods: {
    init() {
      this.loadData()
    },

    onCreateClick() {
      datadogLogs.logger.info(datadogLogEvents.CREATE_MESH_CLICKED)
    },
    tableAction(ev) {
      const data = ev

      // load the data into the tabs
      this.getEntity(data)
    },
    loadData(offset = '0') {
      this.isLoading = true
      this.hasError = false
      this.isEmpty = false

      const mesh = this.$route.params.mesh

      const params = {
        size: this.pageSize,
        offset,
      }

      const endpoint = mesh === 'all' || !mesh ? Kuma.getAllMeshes(params) : Kuma.getMesh(mesh)

      const getMeshes = () =>
        endpoint
          .then((response) => {
            const cleanRes = () => {
              if (mesh === 'all') {
                return response.items
              }

              const newItems = { items: [] }

              newItems.items.push(response)

              return newItems.items
            }

            this.next = Boolean(response.next)

            const items = cleanRes()

            if (items.length > 0) {
              // sort the table data by name and the mesh it's associated with
              if (mesh === 'all') {
                this.sortEntities(items)
              }

              // set the first item as the default for initial load
              this.firstEntity = items[0].name

              // load the YAML entity for the first item on page load
              this.getEntity(items[0])

              this.tableData.data = [...items]
              this.tableDataIsEmpty = false
              this.isEmpty = false
            } else {
              this.tableData.data = []
              this.tableDataIsEmpty = true
              this.isEmpty = true

              this.getEntity(null)
            }
          })
          .catch((error) => {
            this.hasError = true
            this.isEmpty = true

            console.error(error)
          })
          .finally(() => {
            setTimeout(() => {
              this.isLoading = false
            }, process.env.VUE_APP_DATA_TIMEOUT)
          })

      getMeshes()
    },
    getEntity(entity) {
      this.entityIsLoading = true
      this.entityIsEmpty = false
      this.entityHasError = false

      if (entity && entity !== null) {
        return Kuma.getMesh(entity.name)
          .then((response) => {
            if (response) {
              Kuma.getMeshInsights(entity.name).then((meshInsightResponse) => {
                this.meshInsight = meshInsightResponse
              })

              // get the counts for this mesh

              // const col1 = getSome(response, ['type', 'name', 'creationTime', 'modificationTime'])
              const col1 = getSome(response, ['type', 'name'])

              const formatted = () => {
                const data = Object.entries(getSome(response, ['mtls', 'logging', 'metrics', 'tracing']))
                const newData = []

                data.forEach((i) => {
                  const label = i[0]
                  const subData = i[1] || null

                  /**
                   * If `enabledBackend` is present, this will match it against
                   * the name found in `backends`, get the `type` from there, and
                   * output the defaultBackend name alongside its matched `type`.
                   *
                   * For Tracing, `defaultBackend` is used instead of `enabledBackend`.
                   */

                  if (subData && subData.enabledBackend) {
                    const enabled = subData.enabledBackend
                    const matched = subData.backends.find((obj) => obj.name === enabled)

                    if (matched) {
                      newData.push({
                        label: label,
                        value: {
                          type: matched.type,
                          name: matched.name,
                        },
                      })
                    }
                  } else if (subData && subData.defaultBackend) {
                    const enabled = subData.defaultBackend
                    const matched = subData.backends.find((obj) => obj.name === enabled)

                    if (matched) {
                      newData.push({
                        label: label,
                        value: {
                          type: matched.type,
                          name: matched.name,
                        },
                      })
                    }
                  } else if (subData && subData.backends) {
                    const backends = subData.backends[0]

                    if (backends) {
                      newData.push({
                        label: label,
                        value: {
                          type: backends.type,
                          name: backends.name,
                        },
                      })
                    }
                  } else {
                    newData.push({
                      label: label,
                      value: null,
                    })
                  }
                })

                return newData
              }

              const isRoutingEnabled = () => {
                const { routing } = response

                return routing && routing.localityAwareLoadBalancing
              }

              this.tabGroupTitle = `Mesh: ${col1.name}`
              this.entityOverviewTitle = `Entity Overview for ${col1.name}`

              this.entity = {
                basicData: col1,
                extendedData: formatted(),
                localityEnabled: isRoutingEnabled(),
              }

              // this.rawEntity = response
              this.rawEntity = stripTimes(response)
            } else {
              this.entity = null
              this.entityIsEmpty = true
            }
          })
          .catch((error) => {
            this.entityHasError = true
            console.error(error)
          })
          .finally(() => {
            setTimeout(() => {
              this.entityIsLoading = false
            }, process.env.VUE_APP_DATA_TIMEOUT)
          })
      } else {
        setTimeout(() => {
          this.entityIsEmpty = true
          this.entityIsLoading = false
        }, process.env.VUE_APP_DATA_TIMEOUT)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.add-mesh-button {
  background-color: var(--logo-green) !important;
}
</style>
