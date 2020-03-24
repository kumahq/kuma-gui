<template>
  <div class="traffic-permissions">
    <DataOverview
      :has-error="hasError"
      :is-loading="isLoading"
      :is-empty="isEmpty"
      :empty-state="empty_state"
      :display-data-table="true"
      :table-data="tableData"
      :table-data-is-empty="tableDataIsEmpty"
      table-actions-route-name="fault-injections-details"
      @reloadData="bootstrap"
    >
      <template slot="tableDataActionsLinkText">
        View
      </template>
    </DataOverview>
  </div>
</template>

<script>
import DataOverview from '@/components/Skeletons/DataOverview'

export default {
  name: 'FaultInjections',
  metaInfo: {
    title: 'Fault Injections'
  },
  components: {
    DataOverview
  },
  data () {
    return {
      isLoading: true,
      isEmpty: false,
      hasError: false,
      tableDataIsEmpty: false,
      empty_state: {
        title: 'No Data',
        message: 'There are no Fault Injections present.'
      },
      tableData: {
        headers: [
          { label: 'Name', key: 'name' },
          { label: 'Mesh', key: 'mesh' },
          { label: 'Type', key: 'type' },
          { key: 'actions', hideLabel: true }
        ],
        data: []
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
    bootstrap () {
      this.isLoading = true
      this.isEmpty = false

      const mesh = this.$route.params.mesh

      const getFaultInjections = () => {
        return this.$api.getFaultInjections(mesh)
          .then(response => {
            if (response.items.length > 0) {
              const items = response.items

              // sort the table data by name and the mesh it's associated with
              items
                .sort((a, b) => (a.name > b.name) ? 1 : (a.name === b.name) ? ((a.mesh > b.mesh) ? 1 : -1) : -1)

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

      getFaultInjections()
    }
  }
}
</script>

<style>
</style>
