<template>
  <div class="dataplanes-detail">
    <YamlView
      title="Entity Overview"
      :content="entity"
    />
  </div>
</template>

<script>
import YamlView from '@/components/Skeletons/YamlView'
import MetricGrid from '@/components/Metrics/MetricGrid.vue'

export default {
  name: 'TrafficLogDetail',
  metaInfo: {
    title: 'Traffic Log Details'
  },
  components: {
    MetricGrid,
    YamlView
  },
  data () {
    return {
      entity: null
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
      const mesh = this.$route.params.mesh
      const dataplane = this.$route.params.dataplane

      return this.$api.getTrafficLogs(mesh)
        .then(response => {
          this.entity = response
        })
        .catch(error => {
          console.error(error)
          this.entity = error
        })
    }
  }
}
</script>

<style>
</style>
