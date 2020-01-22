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
  name: 'TrafficRouteDetail',
  metaInfo: {
    title: 'Traffic Route Details'
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
      const trafficroute = this.$route.params.trafficroute

      return this.$api.getTrafficRoute(mesh, trafficroute)
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
