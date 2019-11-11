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
          { label: 'Mesh', key: 'name' },
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
          value: 1234567
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
      this.$store.dispatch('getMeshTotalCount')
      this.$store.dispatch('getDataplanFromMeshTotalCount', this.$route.params.mesh)

      const getMeshData = () => {
        return this.$api.getAllMeshes()
          .then(response => {
            const items = response.items
            const rows = items.map(item => ({
              name: item.name,
              type: item.type
            }))

            this.tableData.data.push(...rows)
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
