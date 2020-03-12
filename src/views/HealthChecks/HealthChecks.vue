<template>
  <div class="health-checks">
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
      :initial-tab="initialTab"
      :tabs="tabs"
      :tab-group-title="tabGroupTitle"
    >
      <!--
        The tabbed content should look for the first entity present
        based on the mesh that is selected. When the user clicks the link
        on a table row, the data for that item is then loaded into the
        tab content panels.
      -->
      <template slot="tab-link-overview">
        Overview
      </template>
      <template slot="tab-content-overview">
        <h3 class="xl">
          Overview Content
        </h3>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit
          error iusto beatae fugit nemo, aliquid modi itaque aliquam, perferendis
          nostrum praesentium optio. Quia esse voluptas corporis ipsa porro!
          Recusandae, tempora.
        </p>
      </template>

      <template slot="tab-link-yaml-view">
        YAML
      </template>
      <template slot="tab-content-yaml-view">
        <!-- <h3 class="xl">
          Entity
        </h3> -->
        <YamlView
          :title="entityOverviewTitle"
          :has-error="yamlHasError"
          :is-loading="yamlIsLoading"
          :is-empty="yamlIsEmpty"
          :content="entity"
        />
      </template>
    </Tabs>
  </div>
</template>

<script>
import DataOverview from '@/components/Skeletons/DataOverview'
import Tabs from '@/components/Utils/Tabs'
import YamlView from '@/components/Skeletons/YamlView'

export default {
  name: 'HealthChecks',
  metaInfo: {
    title: 'Health Checks'
  },
  components: {
    DataOverview,
    Tabs,
    YamlView
  },
  data () {
    return {
      isLoading: true,
      isEmpty: false,
      hasError: false,
      yamlIsLoading: true,
      yamlIsEmpty: false,
      yamlHasError: false,
      tableDataIsEmpty: false,
      empty_state: {
        title: 'No Data',
        message: 'There are no Health Checks present.'
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
      initialTab: 'yaml-view',
      tabs: [
        'overview',
        'yaml-view'
      ],
      entity: null,
      firstEntity: null
    }
  },
  computed: {
    tabGroupTitle () {
      const mesh = this.$route.params.mesh || null

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
      const dataSource = ev

      this.getEntity(dataSource)
    },
    bootstrap () {
      this.isLoading = true
      this.isEmpty = false

      const mesh = this.$route.params.mesh

      const getHealthChecks = () => {
        return this.$api.getHealthChecks(mesh)
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

              this.tableData.data = [...items]
              this.tableDataIsEmpty = false
            } else {
              this.tableData.data = []
              this.tableDataIsEmpty = true
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

      getHealthChecks()
    },
    getEntity (entity) {
      this.yamlIsLoading = true
      this.yamlIsEmpty = false

      const mesh = this.$route.params.mesh

      return this.$api.getHealthCheckFromMesh(mesh, entity)
        .then(response => {
          if (response) {
            this.entity = response
          } else {
            this.entity = null
            this.yamlIsEmpty = true
          }
        })
        .catch(error => {
          this.yamlHasError = true
          console.error(error)
        })
        .finally(() => {
          setTimeout(() => {
            this.yamlIsLoading = false
          }, process.env.VUE_APP_DATA_TIMEOUT)
        })
    }
  }
}
</script>

<style>
</style>
