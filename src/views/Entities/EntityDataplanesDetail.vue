<template>
  <div class="dataplanes-detail">
    <YamlView
      title="Entity Overview"
      :content="content"
    />
  </div>
</template>

<script>
import YamlView from '@/components/Skeletons/YamlView'
import MetricGrid from '@/components/Metrics/MetricGrid.vue'

export default {
  name: 'DataplanesDetails',
  metaInfo: {
    title: 'Dataplane Details'
  },
  components: {
    MetricGrid,
    YamlView
  },
  data () {
    return {
      content: null
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

      return this.$api.getDataplaneOverviews(mesh, dataplane)
        .then(response => {
          this.content = response
        })
        .catch(error => {
          console.error(error)
        })
    }
  }
}
</script>

<style>
</style>
