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
      :has-error="hasError"
      :is-loading="isLoading"
      :is-empty="isEmpty"
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
        <ul class="overview-entity-list">
          <li
            v-for="(value, key) in entity"
            :key="key"
          >
            <h4 class="lg font-bold">
              {{ key }}:
            </h4>
            <p>
              <code>{{ value }}</code>
            </p>
          </li>
        </ul>
      </template>

      <template slot="tab-link-yaml-view">
        YAML
      </template>
      <template slot="tab-content-yaml-view">
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
      initialTab: 'overview',
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

      this.getEntity(data)
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

      getHealthChecks()
    },
    getEntity (entity) {
      this.yamlIsLoading = true
      this.yamlIsEmpty = false

      const mesh = this.$route.params.mesh

      if (entity) {
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
      } else {
        setTimeout(() => {
          this.yamlIsEmpty = true
          this.yamlIsLoading = false
        }, process.env.VUE_APP_DATA_TIMEOUT)
      }
    }
  }
}
</script>
