<template>
  <div class="dataplanes-detail">
    <p>Hello world</p>
    <p>This is the Dataplanes Detail view.</p>
  </div>
</template>

<script>
import MetricGrid from '@/components/Metrics/MetricGrid.vue'

export default {
  name: 'DataplanesDetails',
  metaInfo: {
    title: 'Dataplane Details'
  },
  components: {
    MetricGrid
  },
  data () {
    return {
    }
  }
}
</script>

<style>
</style>
