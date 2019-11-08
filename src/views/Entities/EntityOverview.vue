<template>
  <div class="overview">
    <MetricGrid :metrics="mockMetricsData" />
    <!-- charts and stats will go here once we have data to work with -->
  </div>
</template>

<script>
// import { options as timeFrameOptions } from '@/schemas/TimeFrames'
import MetricGrid from '@/components/Metrics/MetricGrid'
// import TimeFramePicker from '@/pdk/components/TimeFramePicker'

export default {
  name: 'Overview',
  metaInfo () {
    return {
      title: `${this.$route.meta.title} for ${this.$route.params.mesh}`
    }
  },
  components: {
    MetricGrid
    // TimeFramePicker
  },
  computed: {
    mockMetricsData () {
      return [
        {
          metric: 'Number of Dataplanes',
          value: this.$store.state.totalDataplaneCountFromMesh
        }
      ]
    }
  },
  watch: {
    $route (to, from) {
      this.setAndGetDataplaneCount()
    }
  },
  beforeMount () {
    this.setAndGetDataplaneCount()
  },
  methods: {
    // get the total number of dataplanes from selected mesh
    setAndGetDataplaneCount () {
      this.$store.dispatch('getDataplanFromMeshTotalCount', this.$route.params.mesh)
    }
  }
}
</script>
