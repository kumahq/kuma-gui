<template>
  <div class="traffic-permissions">
    <KTable
      v-if="tableData.data.length"
      has-hover
      :options="tableData"
    />
    <div v-else>
      <p>There are no traffic logs tied to <strong>{{ this.$route.params.mesh }}</strong></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TrafficLogs',
  metaInfo: {
    title: 'Traffic Logs'
  },
  data () {
    return {
      tableData: {
        headers: [
          { label: 'Name', key: 'name' },
          { label: 'Mesh', key: 'mesh' },
          { label: 'Type', key: 'type' }
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
      const mesh = this.$route.params.mesh

      const getTrafficLogs = () => {
        return this.$api.getTrafficLogs(mesh)
          .then(response => {
            const items = response.items

            if (items && items.length) {
              this.tableData.data = [...items]
            } else {
              this.tableData.data = []
            }
          })
          .catch(error => {
            console.error(error)
          })
      }

      getTrafficLogs()
    }
  }
}
</script>

<style>
</style>
