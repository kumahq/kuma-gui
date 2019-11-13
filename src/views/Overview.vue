<template>
  <div class="overview">
    <page-header noflex>
      <h2 class="title-3x">
        {{ this.$route.meta.title }}
      </h2>
    </page-header>
    <MetricGrid
      :metrics="overviewMetrics"
    />
    <KTable
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PageHeader from '@/components/Utils/PageHeader.vue'
import MetricGrid from '@/components/Metrics/MetricGrid'
import KSkeleton from '@/components/Skeletons/KSkeleton'
// import { options as timeFrameOptions } from '@/schemas/TimeFrames'
// import TimeFramePicker from '@/pdk/components/TimeFramePicker'

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
      this.$store.dispatch('getDataplanFromMeshTotalCount', this.$route.params.mesh)

      // get the total dataplane count
      this.$store.dispatch('getDataplaneTotalCount')

      // prepare and populate the table data
      const getMeshData = () => {
        return this.$api.getAllMeshes()
          .then(response => {
            this.tableData.data.push(...response.items)
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
