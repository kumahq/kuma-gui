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
  name: 'ProxyTemplatesDetail',
  metaInfo: {
    title: 'Proxy Template Details'
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
      const proxytemplate = this.$route.params.proxytemplate

      return this.$api.getProxyTemplate(mesh, proxytemplate)
        .then(response => {
          if (response) {
            this.entity = response
          } else {
            this.$router.push('/404')
          }
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
