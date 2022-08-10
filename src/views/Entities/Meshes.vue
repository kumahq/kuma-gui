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
          <div v-if="entity.basicData">
            <h3> Mesh: {{ entity.basicData.name }}</h3>
          </div>
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
import { mapGetters } from 'vuex'
import { datadogLogs } from '@datadog/browser-logs'

import Kuma from '@/services/kuma'
import { getTableData } from '@/utils/tableDataUtils'
import { getEmptyInsight, getInitialPolicies } from '@/store/reducers/mesh-insights'
import { datadogLogEvents } from '@/datadogEvents'
import { getSome, humanReadableDate, rawReadableDate, stripTimes } from '@/helpers'
import FrameSkeleton from '@/components/Skeletons/FrameSkeleton'
import DataOverview from '@/components/Skeletons/DataOverview'
import Tabs from '@/components/Utils/Tabs'
import YamlView from '@/components/Skeletons/YamlView'
import LabelList from '@/components/Utils/LabelList'
import { PAGE_SIZE_DEFAULT, POLICY_MAP } from '@/consts'

export default {
  name: 'Meshes',
  metaInfo: {
    title: 'Meshes',
  },
  components: {
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
      entity: {},
      rawEntity: {},
      pageSize: PAGE_SIZE_DEFAULT,
      next: null,
      itemsPerCol: 3,
      meshInsight: getEmptyInsight(),
    }
  },
  computed: {
    ...mapGetters({
      featureFlags: 'config/featureFlags',
    }),
    counts() {
      const {
        policies: allPolicies,
        dataplanes: { total },
      } = this.meshInsight

      const policies = {
        ...getInitialPolicies(),
        ...allPolicies,
      }

      return [
        {
          title: 'Data plane proxies',
          value: total,
        },
        {
          title: POLICY_MAP.CircuitBreaker.title,
          value: policies.CircuitBreaker.total,
        },
        {
          title: POLICY_MAP.FaultInjection.title,
          value: policies.FaultInjection.total,
        },
        {
          title: POLICY_MAP.HealthCheck.title,
          value: policies.HealthCheck.total,
        },
        {
          title: POLICY_MAP.ProxyTemplate.title,
          value: policies.ProxyTemplate.total,
        },
        {
          title: POLICY_MAP.TrafficLog.title,
          value: policies.TrafficLog.total,
        },
        {
          title: POLICY_MAP.TrafficPermission.title,
          value: policies.TrafficPermission.total,
        },
        {
          title: POLICY_MAP.TrafficRoute.title,
          value: policies.TrafficRoute.total,
        },
        {
          title: POLICY_MAP.TrafficTrace.title,
          value: policies.TrafficTrace.total,
        },
        {
          title: POLICY_MAP.RateLimit.title,
          value: policies.RateLimit.total,
        },
        {
          title: POLICY_MAP.Retry.title,
          value: policies.Retry.total,
        },
        {
          title: POLICY_MAP.Timeout.title,
          value: policies.Timeout.total,
        },
        {
          title: POLICY_MAP.MeshGateway.title,
          value: policies.MeshGateway.total,
        },
        {
          title: POLICY_MAP.MeshGatewayRoute.title,
          value: policies.MeshGatewayRoute.total,
        },
      ]
    },
    countCols() {
      return Math.ceil(this.counts.length / this.itemsPerCol)
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
    async loadData(offset = '0') {
      this.isLoading = true
      this.isEmpty = false

      const mesh = this.$route.params.mesh
      let query

      if (mesh !== 'all') {
        query = this.$route.params.mesh
      }

      try {
        const { data, next } = await getTableData({
          getSingleEntity: Kuma.getMesh.bind(Kuma),
          getAllEntities: Kuma.getAllMeshes.bind(Kuma),
          size: this.pageSize,
          offset,
          query,
        })

        // set pagination
        this.next = next

        // set table data
        if (data.length) {
          this.tableData.data = [...data]
          this.tableDataIsEmpty = false
          this.isEmpty = false

          this.getEntity({ name: data[0].name })
        } else {
          this.tableData.data = []
          this.tableDataIsEmpty = true
          this.isEmpty = true
          this.entityIsEmpty = true
        }
      } catch (error) {
        this.hasError = true
        this.isEmpty = true

        console.error(error)
      } finally {
        this.isLoading = false
      }
    },
    getEntity(entity) {
      this.entityIsLoading = true
      this.entityIsEmpty = false
      this.entityHasError = false

      if (entity && entity !== null) {
        return Kuma.getMesh({ name: entity.name })
          .then((response) => {
            if (response) {
              Kuma.getMeshInsights({ name: entity.name }).then((meshInsightResponse) => {
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

              this.entity = {
                basicData: col1,
                extendedData: formatted(),
                localityEnabled: isRoutingEnabled(),
              }

              // this.rawEntity = response
              this.rawEntity = stripTimes(response)
            } else {
              this.entity = {}
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
