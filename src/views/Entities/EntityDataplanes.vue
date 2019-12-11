<template>
  <div class="dataplanes">
    <DataOverview
      :empty-state="empty_state"
      :display-data-table="true"
      :table-data="tableData"
      :table-data-is-empty="tableDataIsEmpty"
      table-actions-route-name="dataplane-details"
    >
      <!-- <template slot="tableDataActionsLinkText">
        View Entity
      </template> -->
    </DataOverview>
  </div>
</template>

<script>
import DataOverview from '@/components/Skeletons/DataOverview'

export default {
  name: 'Dataplanes',
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
        message: 'There are no items present.',
        ctaText: 'Hello World'
      },
      tableData: {
        headers: [
          { label: 'Name', key: 'name' },
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

      // get the mesh from our route params
      const mesh = this.$route.params.mesh

      // prepare and populate the table data
      const getMeshData = () => {
        return this.$api.getAllDataplanesFromMesh(mesh)
          .then(response => {
            const items = response.items

            if (items && items.length) {
              this.tableData.data = [...items]
              this.tableDataIsEmpty = false
            } else {
              this.tableData.data = []
              this.tableDataIsEmpty = true
            }
          })
          .catch(error => {
            this.tableDataIsEmpty = true
            this.isEmpty = true

            console.error(error)
          })
      }

      getMeshData()
    }
  }
}
</script>
