<template>
  <div class="traffic-permissions">
    <div
      v-if="securityWarning"
      class="alert-wrapper"
    >
      <KAlert appearance="warning">
        <template slot="alertMessage">
          <div class="alert-content">
            <p>
              <strong>All traffic is allowed:</strong> All service traffic is
              enabled on this Mesh by default because Mutual TLS is not enabled.
              Traffic Permissions are currently being ignored by the
              <strong>{{ $route.params.mesh }}</strong> Mesh because Mutual TLS
              is not enabled. You can still create and edit Traffic Permissions,
              but they will go into effect only when Mutual TLS is enabled on the Mesh.
            </p>
          </div>
        </template>
      </KAlert>
    </div>
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
        table-data-row="name"
        @tableAction="tableAction"
        @reloadData="loadData"
      >
        <template slot="additionalControls">
          <KButton
            v-if="this.$route.query.ns"
            class="back-button"
            appearance="primary"
            size="small"
            :to="{
              name: 'traffic-permissions'
            }"
          >
            <span class="custom-control-icon">
              &larr;
            </span>
            View All
          </KButton>
        </template>
        <template slot="pagination">
          <Pagination
            :has-previous="previous.length > 0"
            :has-next="hasNext"
            @next="goToNextPage"
            @previous="goToPreviousPage"
          />
        </template>
      </DataOverview>
      <Tabs
        v-if="isEmpty === false"
        :has-error="hasError"
        :is-loading="isLoading"
        :tabs="tabs"
        :tab-group-title="tabGroupTitle"
        initial-tab-override="overview"
      >
        <template slot="tabHeader">
          <div>
            <h3>{{ tabGroupTitle }}</h3>
          </div>
          <div>
            <EntityURLControl :url="shareUrl" />
          </div>
        </template>
        <template slot="overview">
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
        <template slot="yaml">
          <YamlView
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
import EntityURLControl from '@/components/Utils/EntityURLControl'
import sortEntities from '@/mixins/EntitySorter'
import FrameSkeleton from '@/components/Skeletons/FrameSkeleton'
import Pagination from '@/components/Pagination'
import DataOverview from '@/components/Skeletons/DataOverview'
import Tabs from '@/components/Utils/Tabs'
import YamlView from '@/components/Skeletons/YamlView'
import LabelList from '@/components/Utils/LabelList'

export default {
  name: 'TrafficPermissions',
  metaInfo: {
    title: 'Traffic Permissions'
  },
  components: {
    EntityURLControl,
    FrameSkeleton,
    Pagination,
    DataOverview,
    Tabs,
    YamlView,
    LabelList
  },
  mixins: [
    sortEntities
  ],
  data () {
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
        message: 'There are no Traffic Permissions present.'
      },
      tableData: {
        headers: [
          { key: 'actions', hideLabel: true },
          { label: 'Name', key: 'name' },
          { label: 'Mesh', key: 'mesh' },
          { label: 'Type', key: 'type' }
        ],
        data: []
      },
      tabs: [
        {
          hash: '#overview',
          title: 'Overview'
        },
        {
          hash: '#yaml',
          title: 'YAML'
        }
      ],
      entity: [],
      rawEntity: null,
      firstEntity: null,
      pageSize: this.$pageSize,
      pageOffset: null,
      next: null,
      hasNext: false,
      previous: [],
      securityWarning: false
    }
  },
  computed: {
    tabGroupTitle () {
      const entity = this.entity

      if (entity) {
        return `Traffic Permission: ${entity.name}`
      } else {
        return null
      }
    },
    entityOverviewTitle () {
      const entity = this.entity

      if (entity) {
        return `Entity Overview for ${entity.name}`
      } else {
        return null
      }
    },
    shareUrl () {
      const urlRoot = `${window.location.origin}#`
      const entity = this.entity

      const shareUrl = () => {
        if (this.$route.query.ns) {
          return this.$route.fullPath
        }

        return `${urlRoot}${this.$route.fullPath}?ns=${entity.name}`
      }

      return shareUrl()
    }
  },
  watch: {
    '$route' (to, from) {
      this.init()
    }
  },
  beforeMount () {
    this.init()
  },
  methods: {
    init () {
      this.loadData()
      this.mtlsWarning()
    },
    goToPreviousPage () {
      this.pageOffset = this.previous.pop()
      this.next = null

      this.loadData()
    },
    goToNextPage () {
      this.previous.push(this.pageOffset)
      this.pageOffset = this.next
      this.next = null

      this.loadData()
    },
    tableAction (ev) {
      const data = ev

      // reset back to the first tab
      this.$store.dispatch('updateSelectedTab', this.tabs[0].hash)

      // set the active table row
      this.$store.dispatch('updateSelectedTableRow', ev.name)

      // load the data into the tabs
      this.getEntity(data)
    },
    loadData () {
      this.isLoading = true

      const mesh = this.$route.params.mesh || null
      const query = this.$route.query.ns || null

      const params = {
        size: this.pageSize,
        offset: this.pageOffset
      }

      const endpoint = () => {
        if (mesh === 'all') {
          return this.$api.getAllTrafficPermissions(params)
        } else if ((query && query.length) && mesh !== 'all') {
          return this.$api.getTrafficPermission(mesh, query)
        }

        return this.$api.getAllTrafficPermissionsFromMesh(mesh)
      }

      const getTrafficPermissions = () => {
        return endpoint()
          .then(response => {
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
              const firstItem = query
                ? entityList
                : entityList[0]

              // set the first item as the default for initial load
              this.firstEntity = firstItem.name

              // load the YAML entity for the first item on page load
              this.getEntity(stripTimes(firstItem))

              // set the selected table row for the first item on page load
              this.$store.dispatch('updateSelectedTableRow', firstItem.name)

              this.tableData.data = query
                ? [entityList]
                : entityList

              this.tableDataIsEmpty = false
              this.isEmpty = false
            } else {
              this.tableData.data = []
              this.tableDataIsEmpty = true
              this.isEmpty = true

              this.getEntity(null)
            }
          })
          .catch(error => {
            this.hasError = true
            this.isEmpty = true

            console.error(error)
          })
          .finally(() => {
            setTimeout(() => {
              this.isLoading = false
            }, process.env.VUE_APP_DATA_TIMEOUT)
          })
      }

      getTrafficPermissions()
    },
    getEntity (entity) {
      this.entityIsLoading = true
      this.entityIsEmpty = false

      const mesh = this.$route.params.mesh

      if (entity && entity !== null) {
        const entityMesh = (mesh === 'all')
          ? entity.mesh
          : mesh

        return this.$api.getTrafficPermission(entityMesh, entity.name)
          .then(response => {
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
          .catch(error => {
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
    mtlsWarning () {
      const mesh = this.$route.params.mesh
      // we only want to handle mTLS warnings when the user is viewing a single mesh
      const entityMesh = (mesh !== 'all')
        ? mesh
        : null

      if (entityMesh) {
        return this.$api.getMesh(entityMesh)
          .then(response => {
            const { mtls } = response

            if (mtls && mtls.enabledBackend && mtls.enabledBackend.length > 0) {
              // if mTLS is found on the mesh and it's enabled, we don't need to show
              // a warning to the user
              this.securityWarning = false
            } else {
              // otherwise we display it to let them know that it's not yet secured
              this.securityWarning = true
            }
          })
      }

      this.securityWarning = false
    }
  }
}
</script>

<style lang="scss" scoped>
.alert-wrapper {
  margin-bottom: var(--spacing-md);
}
</style>
