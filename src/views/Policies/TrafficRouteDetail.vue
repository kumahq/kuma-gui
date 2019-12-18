<template>
  <div class="dataplanes-detail">
    <KCard
      title="Entity Overview"
      class="w-full md:w-1/2"
    >
      <template slot="body">
        <code><pre>{{ content }}</pre></code>
      </template>
      <template slot="actions">
        <KClipboardProvider v-slot="{ copyToClipboard }">
          <KPop
            placement="bottom"
            :popover-timeout="1000"
          >
            <KButton
              @click="() => { copyToClipboard(content) }"
            >
              Copy to Clipboard
            </KButton>
            <div slot="content">
              <p>Entity copied to clipboard!</p>
            </div>
          </KPop>
        </KClipboardProvider>
      </template>
    </KCard>
  </div>
</template>

<script>
import prettyoutput from 'prettyoutput'
import MetricGrid from '@/components/Metrics/MetricGrid.vue'

export default {
  name: 'TrafficRouteDetail',
  metaInfo: {
    title: 'Traffic Route Details'
  },
  components: {
    MetricGrid
  },
  data () {
    return {
      content: null,
      networkData: null
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

      return this.$api.getTrafficRoutes(mesh)
        .then(response => {
          // this.content = response
          const options = {
            noColor: true,
            maxDepth: 10
          }

          this.content = prettyoutput(response, options)
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
