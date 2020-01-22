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

export default {
  name: 'TrafficLogDetail',
  metaInfo: {
    title: 'Traffic Log Details'
  },
  components: {
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
      const trafficlog = this.$route.params.trafficlog

      return this.$api.getTrafficLog(mesh, trafficlog)
        .then(response => {
          if (response) {
            this.entity = response
          } else {
            this.$router.push('/404')
          }
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
