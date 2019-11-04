<template>
  <div class="overview">
    <MetricGrid :metrics="mockMetricsData" />
    <h3 class="title-2x">
      Get all meshes
    </h3>
    <ul>
      <li
        v-for="(item, index) of mockItems"
        :key="index"
      >
        {{ item.name }}
      </li>
    </ul>
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
    PageHeader,
    PageContent,
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
  },
  mounted () {
    this.fetchMockItems()
  },
  methods: {
    fetchMockItems () {
      return this.$api.getAllMeshes()
        .then(response => {
          this.mockItems = response
        })
        .catch(error => {
          console.error(error)
        })
    }
  }
}
</script>
