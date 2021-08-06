<template>
  <div class="proxy-templates">
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
              name: 'proxy-templates'
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
import { getTableData } from '@/utils/tableDataUtils'
import EntityURLControl from '@/components/Utils/EntityURLControl'
import FrameSkeleton from '@/components/Skeletons/FrameSkeleton'
import Pagination from '@/components/Pagination'
import DataOverview from '@/components/Skeletons/DataOverview'
import Tabs from '@/components/Utils/Tabs'
import YamlView from '@/components/Skeletons/YamlView'
import LabelList from '@/components/Utils/LabelList'
import { PAGE_SIZE_DEFAULT } from '@/consts'

export default {
  name: 'ProxyTemplates',
  metaInfo: {
    title: 'Proxy Templates',
  },
  components: {
    EntityURLControl,
    FrameSkeleton,
    Pagination,
    DataOverview,
    Tabs,
    YamlView,
    LabelList,
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
        message: 'There are no Proxy Templates present.',
      },
      tableData: {
        headers: [
          { key: 'actions', hideLabel: true },
          { label: 'Name', key: 'name' },
          { label: 'Mesh', key: 'mesh' },
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
          hash: '#yaml',
          title: 'YAML',
        },
      ],
      entity: [],
      rawEntity: null,
      firstEntity: null,
      pageSize: PAGE_SIZE_DEFAULT,
      pageOffset: null,
      next: null,
      hasNext: false,
      previous: [],
    }
  },
  computed: {
    tabGroupTitle() {
      const entity = this.entity

      if (entity) {
        return `Proxy Template: ${entity.name}`
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
    async loadData() {
      this.isLoading = true

      const query = this.$route.query.ns || null
      const mesh = this.$route.params.mesh || null

      try {
        const { data, next } = await getTableData({
          getSingleEntity: this.$api.getProxyTemplate.bind(this.$api),
          getAllEntities: this.$api.getAllProxyTemplates.bind(this.$api),
          getAllEntitiesFromMesh: this.$api.getAllProxyTemplatesFromMesh.bind(this.$api),
          mesh,
          query,
          size: this.pageSize,
          offset: this.pageOffset,
        })

        // set pagination
        this.next = next
        this.hasNext = !!next

        // set table data

        if (data.length) {
          this.tableData.data = data
          this.tableDataIsEmpty = false
          this.isEmpty = false

          const selected = ['type', 'name', 'mesh']
          const selectedEntity = data[0]

          this.entity = getSome(selectedEntity, selected)
          this.rawEntity = stripTimes(selectedEntity)
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
        this.entityIsLoading = false
      }
    },
    getEntity(entity) {
      this.entityIsLoading = true
      this.entityIsEmpty = false
      this.entityHasError = false

      const mesh = this.$route.params.mesh

      if (entity) {
        const entityMesh = mesh === 'all' ? entity.mesh : mesh

        return this.$api
          .getProxyTemplate(entityMesh, entity.name)
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

<style>
</style>
