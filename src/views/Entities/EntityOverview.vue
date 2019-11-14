<template>
  <div
    v-if="isLoaded"
    class="overview"
  >
    <MetricGrid
      :metrics="metricsData"
    />
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
  data () {
    return {
      isLoaded: false
    }
  },
  computed: {
    metricsData () {
      return [
        {
          metric: 'Number of Dataplanes',
          value: this.$store.state.totalDataplaneCountFromMesh
        }
      ]
    }
  },
  watch: {
    '$route' (to, from) {
      this.bootstrap()
    }
  },
  beforeMount () {
    this.bootstrap()
  },
  methods: {
    bootstrap () {
      // get the total number of dataplanes from selected mesh
      this.$store.dispatch('getDataplanFromMeshTotalCount', this.$route.params.mesh)

      this.isLoaded = true
    }
  }
}
</script>
