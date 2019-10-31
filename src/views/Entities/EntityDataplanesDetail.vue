<template>
  <div class="dataplanes-detail">
    <MetricGrid :metrics="mockMetricsData" />
  </div>
</template>

<script>
import MetricGrid from '@/components/Metrics/MetricGrid.vue'

export default {
  name: 'Dataplanes',
  metaInfo: {
    title: 'Dataplanes'
  },
  components: {
    PageHeader,
    PageContent,
    MetricGrid
  },
  data () {
    return {
      // timeFrameOptions
      mockMetricsData: [
        {
          metric: 'Number of Meshes',
          value: 15
        },
        {
          metric: 'Number of Dataplanes',
          value: 8011
        },
        {
          metric: 'Number of Services',
          value: 120
        },
        {
          metric: 'Total Requests',
          value: 4584997110
        }
      ]
    }
  }
}
</script>

<style>
</style>
