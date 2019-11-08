<template>
  <div class="overview">
    <page-header noflex>
      <h2 class="title-3x">
        {{ this.$route.meta.title }}
      </h2>
    </page-header>
    <MetricGrid
      :metrics="mockMetricsData"
    />
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
  metaInfo () {
    return {
      title: this.$route.meta.title
    }
  },
  components: {
    MetricGrid,
    PageHeader
  },
  computed: {
    mockMetricsData () {
      return [
        {
          metric: 'Total Number of Meshes',
          value: this.$store.state.totalMeshCount
        },
        {
          metric: 'Number of Dataplanes',
          value: 123 // TODO: find a way to calculate this
        }
      ]
    }
  },
  beforeMount () {
    // set the total mesh count so we can fetch it from state
    this.$store.dispatch('getMeshTotalCount')
  }
}
</script>
