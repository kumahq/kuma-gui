<template>
  <div class="overview">
    <page-header noflex>
      <h2 class="xxl">
        {{ this.$route.meta.title }}
      </h2>
    </page-header>
    <MetricGrid
      :metrics="overviewMetrics"
    />
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
    <KEmptyState
      v-else
      cta-is-hidden
    >
      <template slot="title">
        <div class="card-icon mb-3">
          <img src="~@/assets/images/icon-empty-table.svg?external">
        </div>
        No meshes found!
      </template>
    </KEmptyState>
  </div>
</template>

<script>
import PageHeader from '@/components/Utils/PageHeader.vue'
import MetricGrid from '@/components/Metrics/MetricGrid.vue'

export default {
  name: 'Overview',
  metaInfo () {
    return {
      title: this.$route.meta.title
    }
  },
  components: {
    MetricGrid,
    PageHeader
  },
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
  computed: {
    overviewMetrics () {
      return [
        {
          metric: 'Total Number of Meshes',
          value: this.$store.state.totalMeshCount
        },
        {
          metric: 'Total Number of Dataplanes',
          value: this.$store.state.totalDataplaneCount
        }
      ]
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
      // get the total mesh count
      this.$store.dispatch('getMeshTotalCount')

      // get the total dataplane count within this mesh
      this.$store.dispatch('getDataplaneFromMeshTotalCount', this.$route.params.mesh)

      // get the total dataplane count
      this.$store.dispatch('getDataplaneTotalCount')

      // prepare and populate the table data
      const getMeshData = () => {
        return this.$api.getAllMeshes()
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

<style lang="scss">
.empty-state-title {

  .card-icon {
    text-align: center;

    img, svg {
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
  }
}
</style>
