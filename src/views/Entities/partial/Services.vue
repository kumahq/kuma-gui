<template>
  <div>
    <FrameSkeleton>
      <DataOverview
        :page-size="pageSize"
        :has-error="hasError"
        :is-loading="isLoading"
        :empty-state="empty_state"
        :display-data-table="true"
        :table-data="tableData"
        :table-data-is-empty="tableDataIsEmpty"
        table-data-function-text="View"
        :next="next"
        @tableAction="tableAction"
        @loadData="loadData($event)"
      >
        >
        <template v-slot:additionalControls>
          <KButton
            v-if="$route.query.ns"
            class="back-button"
            appearance="primary"
            size="small"
            :to="{
              name: routeName
            }"
          >
            <span class="custom-control-icon">
              &larr;
            </span>
            View All
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
          <div>
            <EntityURLControl :url="shareUrl" />
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
                  v-for="(val, key) in entity"
                  :key="key"
                >
                  <h4>{{ key }}</h4>
                  <p>
                    {{ val }}
                  </p>
                </li>
              </ul>
            </div>
          </LabelList>
        </template>
        <template v-slot:yaml>
          <YamlView
            lang="yaml"
            :title="entityOverviewTitle"
            :has-error="entityHasError"
            :is-loading="entityIsLoading"
            :is-empty="entityIsEmpty"
            :content="rawEntity"
          />
        </template>
      </Tabs>
    </FrameSkeleton>
  </div>
</template>

<script>
import { getSome, stripTimes } from '@/helpers'
import Kuma from '@/services/kuma'
import EntityURLControl from '@/components/Utils/EntityURLControl'
import sortEntities from '@/mixins/EntitySorter'
import FormatForCLI from '@/mixins/FormatForCLI'
import FrameSkeleton from '@/components/Skeletons/FrameSkeleton'
import DataOverview from '@/components/Skeletons/DataOverview'
import Tabs from '@/components/Utils/Tabs'
import YamlView from '@/components/Skeletons/YamlView'
import LabelList from '@/components/Utils/LabelList'
import { OFFLINE, ONLINE, PARTIALLY_DEGRADED, PAGE_SIZE_DEFAULT } from '@/consts'

export default {
  name: 'Services',

  components: {
    EntityURLControl,
    FrameSkeleton,
    DataOverview,
    Tabs,
    YamlView,
    LabelList,
  },
  mixins: [FormatForCLI, sortEntities],
  props: {
    routeName: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: '',
    },
    tabHeaders: {
      type: Array,
      required: true,
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
        message: `There are not ${this.name} present.`,
      },
      tableData: {
        headers: this.tabHeaders,
        data: [],
      },
      tabs: [
        {
          hash: '#overview',
          title: 'Overview',
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
    }
  },
  computed: {
    tabGroupTitle() {
      const entity = this.entity

      if (entity) {
        return `${this.name}: ${entity.name}`
      } else {
        return null
      }
    },
    entityOverviewTitle() {
      const entity = this.entity

      if (entity) {
        return `Entity Overview for ${entity.name}`
      } else {
        return null
      }
    },
    formattedRawEntity() {
      const entity = this.formatForCLI(this.rawEntity)

      return entity
    },
    shareUrl() {
      const urlRoot = `${window.location.origin}#`
      const entity = this.entity

      const shareUrl = () => {
        if (this.$route.query.ns) {
          return this.$route.fullPath
        }

        return `${urlRoot}${this.$route.fullPath}?ns=${entity.name}`
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
    getAllServices(params) {
      return this.name === 'Internal Services'
        ? Kuma.getAllServiceInsights(params)
        : Kuma.getAllExternalServices(params)
    },
    getService(mesh, query, params) {
      return this.name === 'Internal Services'
        ? Kuma.getServiceInsight(mesh, query, params)
        : Kuma.getAllExternalServices(mesh, query, params)
    },
    getServiceFromMesh(mesh) {
      return this.name === 'Internal Services'
        ? Kuma.getAllServiceInsightsFromMesh(mesh)
        : Kuma.getAllExternalServicesFromMesh(mesh)
    },
    parseData(entity) {
      if (this.name === 'Internal Services') {
        const { dataplanes = {} } = entity
        const { online = 0, total = 0 } = dataplanes

        entity.totalOnline = `${online} / ${total}`

        switch (entity.status) {
          case 'online':
            entity.status = ONLINE
            break
          case 'partially_degraded':
            entity.status = PARTIALLY_DEGRADED
            break
          case 'offline':
          default:
            entity.status = OFFLINE
        }

        return entity
      }

      const { networking = {} } = entity
      const { tls = {} } = networking

      entity.address = networking.address
      entity.tlsEnabled = tls.enabled ? 'Enabled' : 'Disabled'

      return entity
    },
    init() {
      this.loadData()
    },
    goToPreviousPage() {
      this.pageOffset = this.previous.pop()
      this.next = null

      this.loadData()
    },
    goToNextPage() {
      this.previous.push(this.pageOffset)
      this.pageOffset = this.next
      this.next = null

      this.loadData()
    },
    tableAction(ev) {
      const data = ev

      // load the data into the tabs
      this.getEntity(data)
    },
    loadData(offset = '0') {
      this.isLoading = true

      const mesh = this.$route.params.mesh || null
      const query = this.$route.query.ns || null

      const params = {
        size: this.pageSize,
        offset,
      }

      const endpoint = () => {
        if (mesh === 'all') {
          return this.getAllServices(params)
        } else if (query && query.length && mesh !== 'all') {
          return this.getService(mesh, query, params)
        }

        return this.getServiceFromMesh(mesh)
      }

      const getService = () =>
        endpoint()
          .then((response) => {
            const items = () => {
              const r = response

              if ('total' in r) {
                if (r.total !== 0 && r.items && r.items.length > 0) {
                  return this.sortEntities(r.items)
                }

                return null
              }

              return r
            }

            const entityList = items()

            if (items()) {
              const firstItem = query ? entityList : entityList[0]

              // set the first item as the default for initial load
              this.firstEntity = firstItem.name

              // load the YAML entity for the first item on page load
              this.getEntity(stripTimes(firstItem))

              this.tableData.data = query ? [entityList] : entityList

              this.next = Boolean(response.next)

              this.tableData.data = this.tableData.data.map(this.parseData)

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

      getService()
    },
    getEntity(entity) {
      this.entityIsLoading = true
      this.entityIsEmpty = false
      this.entityHasError = false

      const mesh = this.$route.params.mesh

      if (entity && entity !== null) {
        const entityMesh = mesh === 'all' ? entity.mesh : mesh

        return this.getService(entityMesh, entity.name)
          .then((response) => {
            if (response) {
              const selected = ['type', 'name', 'mesh']

              this.entity = getSome(response, selected)
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
