<template>
  <div class="traffic-traces">
    <FrameSkeleton>
      <DataOverview
        :page-size="6"
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
        @reloadData="bootstrap"
      />
      <Tabs
        :has-error="hasError"
        :is-loading="isLoading"
        :is-empty="isEmpty"
        :tabs="tabs"
        :tab-group-title="tabGroupTitle"
      >
        <template slot="tab-link-overview">
          Overview
        </template>
        <template slot="tab-content-overview">
          <LabelList
            :title="generalOverviewTitle"
            :has-error="entityHasError"
            :is-loading="entityIsLoading"
            :is-empty="entityIsEmpty"
            :items="entity"
          />
        </template>
        <template slot="tab-link-yaml-view">
          YAML
        </template>
        <template slot="tab-content-yaml-view">
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
import { getSome } from '@/helpers'
import FrameSkeleton from '@/components/Skeletons/FrameSkeleton'
import DataOverview from '@/components/Skeletons/DataOverview'
import Tabs from '@/components/Utils/Tabs'
import YamlView from '@/components/Skeletons/YamlView'
import LabelList from '@/components/Utils/LabelList'

export default {
  name: 'TrafficTraces',
  metaInfo: {
    title: 'Traffic Traces'
  },
  components: {
    FrameSkeleton,
    DataOverview,
    Tabs,
    YamlView,
    LabelList
  },
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
        message: 'There are no Traffic Traces present.'
      },
      tableData: {
        headers: [
          { label: 'Name', key: 'name' },
          { label: 'Mesh', key: 'mesh' },
          { label: 'Type', key: 'type' },
          { key: 'actions', hideLabel: true }
        ],
        data: []
      },
      tabs: [
        'overview',
        'yaml-view'
      ],
      entity: null,
      rawEntity: null,
      firstEntity: null
    }
  },
  computed: {
    tabGroupTitle () {
      const mesh = this.$route.params.mesh

      if (mesh) {
        return `Mesh: ${mesh}`
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
    generalOverviewTitle () {
      const entity = this.entity

      if (entity) {
        return `Overview for ${entity.name}`
      } else {
        return null
      }
    }
  },
  watch: {
    '$route' (to, from) {
      this.bootstrap()
    }
  },
  beforeMount () {
    this.bootstrap()
  },
  methods: {
    tableAction (ev) {
      const data = ev

      // reset back to the first tab
      this.$store.dispatch('updateSelectedTab', this.tabs[0])

      // set the active table row
      this.$store.dispatch('updateSelectedTableRow', ev)

      // load the data into the tabs
      this.getEntity(data)
    },
    bootstrap () {
      this.isLoading = true
      this.isEmpty = false

      const mesh = this.$route.params.mesh

      const getTrafficTraces = () => {
        return this.$api.getTrafficTraces(mesh)
          .then(response => {
            if (response.items.length > 0) {
              const items = response.items

              // sort the table data by name and the mesh it's associated with
              items
                .sort((a, b) => (a.name > b.name) ? 1 : (a.name === b.name) ? ((a.mesh > b.mesh) ? 1 : -1) : -1)

              // set the first item as the default for initial load
              this.firstEntity = items[0].name

              // load the YAML entity for the first item on page load
              this.getEntity(this.firstEntity)

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

      getTrafficTraces()
    },
    getEntity (entity) {
      this.entityIsLoading = true
      this.entityIsEmpty = false

      const mesh = this.$route.params.mesh

      if (entity && entity !== null) {
        return this.$api.getTrafficTrace(mesh, entity)
          .then(response => {
            if (response) {
              const selected = ['type', 'name', 'mesh']

              this.entity = getSome(response, selected)
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

<style>
</style>
