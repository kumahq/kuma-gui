<template>
  <StatusInfo
    :has-error="hasError"
    :is-loading="isLoading"
  >
    <KCard border-variant="noBorder">
      <template #body>
        <Prism
          id="clusters"
          language="json"
          :code="clusters"
        />
      </template>
      <template #actions>
        <KClipboardProvider
          v-if="clusters"
          v-slot="{ copyToClipboard }"
        >
          <KPop placement="bottom">
            <KButton
              appearance="primary"
              @click="() => { copyToClipboard(clusters) }"
            >
              Copy config to clipboard
            </KButton>
            <template #content>
              <div>
                <p>Config copied to clipboard!</p>
              </div>
            </template>
          </KPop>
        </KClipboardProvider>
      </template>
    </kcard>
  </StatusInfo>
</template>

<script>
import Prism from 'vue-prismjs'

import Kuma from '@/services/kuma'
import StatusInfo from '@/components/Utils/StatusInfo'

export default {
  name: 'EnvoyClusters',
  components: {
    StatusInfo,
    Prism,
  },
  props: {
    mesh: {
      type: String,
      default: '',
    },
    dppName: {
      type: String,
      default: '',
    },
    zoneIngressName: {
      type: String,
      default: '',
    },
    zoneEgressName: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      isLoading: true,
      hasError: false,
    }
  },

  watch: {
    dppName() {
      this.fetchClusters()
    },
    zoneIngressName() {
      this.fetchClusters()
    },
    zoneEgressName() {
      this.fetchClusters()
    },
  },
  mounted() {
    this.fetchClusters()
  },

  methods: {
    async fetchClusters() {
      this.hasError = false
      this.isLoading = true

      try {
        let clusters = ''

        if (this.mesh !== '' && this.dppName !== '') {
          clusters = await Kuma.getDataplaneClusters({
            mesh: this.mesh,
            dppName: this.dppName,
          })
        } else if (this.zoneIngressName !== '') {
          clusters = await Kuma.getZoneIngressClusters({
            zoneIngressName: this.zoneIngressName,
          })
        } else if (this.zoneEgressName !== '') {
          clusters = await Kuma.getZoneEgressClusters({
            zoneEgressName: this.zoneEgressName,
          })
        }

        this.clusters = clusters
      } catch (e) {
        console.error(e)
        this.hasError = true
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
#clusters {
  max-height: 1000px;
}
</style>
