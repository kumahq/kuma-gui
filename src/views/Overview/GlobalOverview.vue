<template>
  <div class="overview">
    <page-header>
      <div>
        <h2 class="title-3x">
          {{ this.$route.meta.title }}
        </h2>
      </div>
      <div class="dashboard-control d-flex flex-wrap">
        <!--
          TimeFramePicker disabled for now because it has a lot of other
          dependencies I haven't tracked down yet
        -->
        <!-- <TimeFramePicker
          :update-controls="updateControls"
          :options="timeFrameOptions"
        /> -->
      </div>
    </page-header>
    <page-content>
      <MetricGrid :metrics="mockMetricsData" />
    </page-content>
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
