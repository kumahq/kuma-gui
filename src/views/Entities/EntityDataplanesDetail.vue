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
  name: 'DataplanesDetails',
  metaInfo: {
    title: 'Dataplane Details'
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
  computed: {
    dataplaneTitle () {
      return this.$route.params.dataplane || null
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
          if (response) {
            this.content = response
          } else {
            // if the dataplane doesn't exist, send the user to the 404
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
