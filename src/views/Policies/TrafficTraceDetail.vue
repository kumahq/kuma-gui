<template>
  <div class="dataplanes-detail">
    <YamlView
      title="Entity Overview"
      :has-error="hasError"
      :is-loading="isLoading"
      :is-empty="isEmpty"
      :content="content"
    />
  </div>
</template>

<script>
import YamlView from '@/components/Skeletons/YamlView'

export default {
  name: 'TrafficTraceDetail',
  metaInfo: {
    title: 'Traffic Trace Details'
  },
  components: {
    YamlView
  },
  data () {
    return {
      content: null,
      hasError: false,
      isLoading: true,
      isEmpty: false
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
      const traffictrace = this.$route.params.traffictrace

      return this.$api.getTrafficTrace(mesh, traffictrace)
        .then(response => {
          if (response) {
            this.content = response
          } else {
            this.$router.push('/404')
          }
        })
        .catch(error => {
          this.hasError = true
          console.error(error)
        })
        .finally(() => {
          setTimeout(() => {
            this.isLoading = false
          }, process.env.VUE_APP_DATA_TIMEOUT)
        })
    }
  }
}
</script>

<style>
</style>
