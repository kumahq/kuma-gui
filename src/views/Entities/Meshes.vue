<template>
  <div class="all-meshes">
    <FrameSkeleton>
      <DataOverview
        :page-size="pageSize"
        :has-error="hasError"
        :is-loading="isLoading"
        :is-empty="isEmpty"
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
            class="add-mesh-button"
            appearance="primary"
            size="small"
            :to="{ path: '/wizard/mesh' }"
          >
            Create Mesh
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
        :has-error="hasError"
        :is-loading="isLoading"
        :is-empty="isEmpty"
        :tabs="tabs"
        :tab-group-title="tabGroupTitle"
        initial-tab-override="overview"
      >
        <template slot="overview">
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
                  <h4>{{ key }}</h4>
                  <p>{{ value }}</p>
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
                  <p v-if="item.value">
                    <span>
                      {{ item.value.type }}
                    </span>
                    <span>
                      {{ item.value.name }}
                    </span>
                  </p>
                  <KBadge
                    v-else
                    appearance="danger"
                  >
                    Disabled
                  </KBadge>
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
import { getSome, getOffset } from '@/helpers'
import sortEntities from '@/mixins/EntitySorter'
import FrameSkeleton from '@/components/Skeletons/FrameSkeleton'
import Pagination from '@/components/Pagination'
import DataOverview from '@/components/Skeletons/DataOverview'
import Tabs from '@/components/Utils/Tabs'
import YamlView from '@/components/Skeletons/YamlView'
import LabelList from '@/components/Utils/LabelList'

export default {
  name: 'Meshes',
  metaInfo: {
    title: 'Meshes'
  },
  components: {
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
        message: 'There are no Meshes present.'
      },
      tableData: {
        headers: [
          { key: 'actions', hideLabel: true },
          { label: 'Name', key: 'name' },
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
      tabGroupTitle: null,
      entityOverviewTitle: null
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
      this.$store.dispatch('updateSelectedTableRow', data.name)

      // load the data into the tabs
      this.getEntity(data)
    },
    loadData () {
      this.isLoading = true
      this.isEmpty = false

      const mesh = this.$route.params.mesh

      const params = {
        size: this.pageSize,
        offset: this.pageOffset
      }

      const endpoint = (mesh === 'all' || !mesh)
        ? this.$api.getAllMeshes(params)
        : this.$api.getMesh(mesh)

      const getMeshes = () => {
        return endpoint
          .then(response => {
            const cleanRes = () => {
              if (mesh === 'all') {
                return response.items
              }

              const newItems = { items: [] }

              newItems.items.push(response)

              return newItems.items
            }

            // check to see if the `next` url is present
            if (response.next) {
              this.next = getOffset(response.next)
              this.hasNext = true
            } else {
              this.hasNext = false
            }

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

              // set the selected table row for the first item on page load
              this.$store.dispatch('updateSelectedTableRow', this.firstEntity)

              this.tableData.data = [...items]
              this.tableDataIsEmpty = false
            } else {
              this.tableData.data = []
              this.tableDataIsEmpty = true

              this.getEntity(null)
            }
          })
          .catch(error => {
            this.hasError = true

            console.error(error)
          })
          .finally(() => {
            setTimeout(() => {
              this.isLoading = false
            }, process.env.VUE_APP_DATA_TIMEOUT)
          })
      }

      getMeshes()
    },
    getEntity (entity) {
      this.entityIsLoading = true
      this.entityIsEmpty = false

      if (entity && entity !== null) {
        return this.$api.getMesh(entity.name)
          .then(response => {
            if (response) {
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
                    const matched = subData.backends.find(obj => obj.name === enabled)

                    newData.push({
                      label: label,
                      value: {
                        type: matched.type,
                        name: matched.name
                      }
                    })
                  } else if (subData && subData.defaultBackend) {
                    const enabled = subData.defaultBackend
                    const matched = subData.backends.find(obj => obj.name === enabled)

                    newData.push({
                      label: label,
                      value: {
                        type: matched.type,
                        name: matched.name
                      }
                    })
                  } else if (subData && subData.backends) {
                    const backends = subData.backends[0]

                    newData.push({
                      label: label,
                      value: {
                        type: backends.type,
                        name: backends.name
                      }
                    })
                  } else {
                    newData.push({
                      label: label,
                      value: null
                    })
                  }
                })

                return newData
              }

              this.tabGroupTitle = `Mesh: ${col1.name}`
              this.entityOverviewTitle = `Entity Overview for ${col1.name}`

              this.entity = {
                basicData: col1,
                extendedData: formatted()
              }
              this.rawEntity = response
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
    }
  }
}
</script>

<style lang="scss" scoped>
.add-mesh-button {
  background-color: var(--logo-green) !important;
}
</style>
