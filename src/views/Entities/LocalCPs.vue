<template>
  <div class="local-cps">
    <page-header noflex>
      <h2 class="xxl">
        {{ pageTitle }}
      </h2>
    </page-header>
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
        initial-tab-override="overview"
      >
        <template slot="tabHeader">
          <div>
            <h3>{{ tabGroupTitle }}</h3>
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
                  v-for="(value, key) in entity"
                  :key="key"
                >
                  <h4>
                    {{ key }}
                  </h4>
                  <p v-if="key === 'status'">
                    <KBadge :appearance="value === 'Offline' ? 'danger' : 'success'">
                      {{ value }}
                    </KBadge>
                  </p>
                  <p v-else>
                    {{ value }}
                  </p>
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
import { humanReadableDate, getOffset } from '@/helpers'
import sortEntities from '@/mixins/EntitySorter'
import PageHeader from '@/components/Utils/PageHeader.vue'
import FrameSkeleton from '@/components/Skeletons/FrameSkeleton'
import Pagination from '@/components/Pagination'
import DataOverview from '@/components/Skeletons/DataOverview'
import Tabs from '@/components/Utils/Tabs'
import LabelList from '@/components/Utils/LabelList'

export default {
  name: 'LocalCPs',
  metaInfo: {
    title: 'Local CPs'
  },
  components: {
    PageHeader,
    FrameSkeleton,
    Pagination,
    DataOverview,
    Tabs,
    LabelList
  },
  filters: {
    formatValue (value) {
      return value ? value.toLocaleString('en').toString() : 0
    },
    readableDate (value) {
      return humanReadableDate(value)
    }
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
          { label: 'Status', key: 'status' },
          { label: 'Name', key: 'name' },
          { label: 'URL', key: 'url' }
        ],
        data: []
      },
      tabs: [
        {
          hash: '#overview',
          title: 'Overview'
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
      entityOverviewTitle: null,
      itemsPerCol: 3
    }
  },
  computed: {
    ...mapState({
      mesh: 'selectedMesh',
      config: 'getConfig'
    }),
    pageTitle () {
      const metaTitle = this.$route.meta.title

      return metaTitle
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

      const endpoint = this.$api.getLocalCPs()

      const getLocalCPs = () => {
        return endpoint
          .then(response => {
            // check to see if the `next` url is present
            if (response.next) {
              this.next = getOffset(response.next)
              this.hasNext = true
            } else {
              this.hasNext = false
            }

            const items = response

            if (items.length > 0) {
              // rewrite the status column to be more human-readable
              items.forEach(i => {
                const status = (i.active === false)
                  ? 'Offline'
                  : 'Online'

                delete i.active

                i.status = status
              })

              // sort the table data by name and the mesh it's associated with
              this.sortEntities(items)

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

      getLocalCPs()
    },
    getEntity (entity) {
      this.entityIsLoading = true
      this.entityIsEmpty = false

      const promise = new Promise((resolve, reject) => {
        if (entity && entity !== null) {
          resolve(entity)
        } else {
          const error = new Error('Entity is either undefined or not present.')

          reject(error)
        }
      })

      if (entity && entity !== null) {
        promise
          .then(response => {
            if (response) {
              this.tabGroupTitle = `Local CP: ${response.name}`
              this.entityOverviewTitle = `Entity Overview for ${response.name}`

              this.entity = response
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
