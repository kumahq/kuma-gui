<template>
  <div class="dataplanes-detail">
    <YamlView
      title="Entity Overview"
      :has-error="hasError"
      :is-loading="isLoading"
      :is-empty="isEmpty"
      :content="content"
    />
    <SnippetGenerator
      :snippets="snippets"
    />
  </div>
</template>

<script>
import YamlView from '@/components/Skeletons/YamlView'
import SnippetGenerator from '@/components/Utils/SnippetGenerator'

export default {
  name: 'DataplanesDetails',
  metaInfo: {
    title: 'Dataplane Details'
  },
  components: {
    YamlView,
    SnippetGenerator
  },
  data () {
    return {
      hasError: false,
      isLoading: true,
      isEmpty: false,
      content: null,
      snippets: [
        {
          label: 'Snippet One',
          code: 'kumactl install control-plane | kubectl apply -f -'
        },
        {
          label: 'Snippet Two',
          code: 'kubectl apply -f https://raw.githubusercontent.com/Kong/kuma/master/examples/kubernetes/sample-service.yaml'
        },
        {
          label: 'Snippet Three',
          code: `echo "apiVersion: kuma.io/v1alpha1
kind: Mesh
metadata:
  name: default
spec:
  mtls:
    enabled: true
    ca:
      builtin: {}" | kubectl apply -f -`
        }
      ]
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
