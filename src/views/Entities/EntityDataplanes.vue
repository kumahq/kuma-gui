<template>
  <div class="dataplanes">
    <KTable
      v-if="tableData.data.length"
      has-hover
      :options="tableData"
    >
      <template
        slot="actions"
        slot-scope="{row}"
      >
        <router-link
          :to="{
            name: 'mesh-overview',
            params: {
              mesh: row.name
            }
          }"
        >
          View Entity
        </router-link>
      </template>
    </KTable>
    <div v-else>
      <p>There are no dataplanes for {{ this.$route.params.mesh }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dataplanes',
  data () {
    return {
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
    $route (to, from) {
      this.bootstrap()
    }
  },
  beforeMount () {
    this.bootstrap()
  },
  methods: {
    bootstrap () {
      // get the mesh from our route params
      const mesh = this.$route.params.mesh

      // prepare and populate the table data
      const getMeshData = () => {
        return this.$api.getAllDataplanesFromMesh(mesh)
          .then(response => {
            const items = response.items

            if (items && items.length) {
              this.tableData.data = [...items]
            }
          })
          .catch(error => {
            console.error(error)
          })
      }

      getMeshData()
    }
  }
}
</script>
