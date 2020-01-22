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
      isDataplaneOnline: true
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
          console.error(error)
        })
    }
  }
}
</script>

<style>
</style>
