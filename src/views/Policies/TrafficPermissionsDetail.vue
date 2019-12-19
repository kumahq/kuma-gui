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
  name: 'TrafficPermissionsDetail',
  metaInfo: {
    title: 'Traffic Permission Details'
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
      const trafficpermission = this.$route.params.trafficpermission

      return this.$api.getTrafficPermissions(mesh, trafficpermission)
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
