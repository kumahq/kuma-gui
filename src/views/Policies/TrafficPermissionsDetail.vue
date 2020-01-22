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
  name: 'TrafficPermissionsDetail',
  metaInfo: {
    title: 'Traffic Permission Details'
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
      const trafficpermission = this.$route.params.trafficpermission

      return this.$api.getTrafficPermission(mesh, trafficpermission)
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
