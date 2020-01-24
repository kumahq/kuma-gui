<template>
  <div class="dataplanes-detail">
    <YamlView
      v-if="isDataplaneOnline"
      title="Entity Overview"
      :content="content"
    />
    <KEmptyState
      v-else
      cta-is-hidden
    >
      <template slot="title">
        <KIcon
          class="kong-icon--centered"
          color="var(--yellow-base)"
          icon="warning"
          size="64"
        />
        <span v-if="dataplaneTitle !== null">
          {{ dataplaneTitle }} is currently offline.
        </span>
        <span v-else>
          This dataplane is currently offline.
        </span>
      </template>
      <!-- <template slot="message">
        <p>
          There was a problem trying to reach the Kuma API. Please try
          restarting Kuma.
        </p>
      </template> -->
    </KEmptyState>
    <SnippetGenerator
      :snippets="snippets"
    />
  </div>
</template>

<script>
import YamlView from '@/components/Skeletons/YamlView'
import MetricGrid from '@/components/Metrics/MetricGrid.vue'
import SnippetGenerator from '@/components/Utils/SnippetGenerator'

export default {
  name: 'DataplanesDetails',
  metaInfo: {
    title: 'Dataplane Details'
  },
  components: {
    MetricGrid,
    YamlView,
    SnippetGenerator
  },
  data () {
    return {
      content: null,
      isDataplaneOnline: true,
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

            // get the dataplane's current subscriptions so that we can determine
            // whether or not the dataplane is online
            const subscriptions = response.dataplaneInsight.subscriptions
            const statusCheck = []

            if (subscriptions && subscriptions.length > 0) {
              for (let i = 0; i < subscriptions.length; i++) {
                const connectTime = subscriptions[i].connectTime
                const disconnectTime = subscriptions[i].disconnectTime

                if (!!connectTime && connectTime.length && !!disconnectTime) {
                  statusCheck.push(false)
                } else {
                  statusCheck.push(true)
                }
              }

              // determine dataplane status if some subscriptions show as being offline
              this.isDataplaneOnline = statusCheck.some(i => i === true)
            } else {
              // if the dataplane returns no subscriptions, flag it as offline
              this.isDataplaneOnline = false
            }
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
