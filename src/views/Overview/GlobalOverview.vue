<template>
  <div class="overview">
    <MetricGrid :metrics="mockMetricsData" />
    <!-- charts and stats will go here once we have data to work with -->
  </div>
</template>

<script>
import PageHeader from '@/components/Utils/PageHeader.vue'
import PageContent from '@/components/Utils/PageContent.vue'
// import { options as timeFrameOptions } from '@/schemas/TimeFrames'
import MetricGrid from '@/components/Metrics/MetricGrid'
// import TimeFramePicker from '@/pdk/components/TimeFramePicker'

export default {
  name: 'Overview',
  components: {
    MetricGrid
    // TimeFramePicker
  },
  data () {
    return {
      // timeFrameOptions,
      mockItems: [],
      mockMetricsData: [
        {
          metric: 'Number of Meshes',
          value: this.$store.state.meshes.length
        },
        {
          metric: 'Number of Dataplanes',
          value: this.$store.state.dataplanes.length
        }
        // {
        //   metric: 'Number of Services',
        //   value: 120
        // },
        // {
        //   metric: 'Total Requests',
        //   value: 4584997110
        // }
      ]
    }
  },
  computed: {
    routes () {
      return false
    }
  }
}
</script>
