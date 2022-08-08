<template>
  <StatusInfo
    :has-error="hasError"
    :is-loading="isLoading"
  >
    <KCard border-variant="noBorder">
      <template v-slot:body>
        <Prism
          id="xds"
          language="json"
          :code="xds"
        />
      </template>
      <template v-slot:actions>
        <KClipboardProvider
          v-if="xds"
          v-slot="{ copyToClipboard }"
        >
          <KPop placement="bottom">
            <KButton
              appearance="primary"
              @click="() => { copyToClipboard(xds) }"
            >
              Copy config to clipboard
            </KButton>
            <template v-slot:content>
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
  name: 'XdsConfiguration',
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
      this.fetchXds()
    },
    zoneIngressName() {
      this.fetchXds()
    },
    zoneEgressName() {
      this.fetchXds()
    },
  },
  mounted() {
    this.fetchXds()
  },

  methods: {
    async fetchXds() {
      this.hasError = false
      this.isLoading = true

      try {
        let xds = {}

        if (this.mesh !== '' && this.dppName !== '') {
          xds = await Kuma.getDataplaneXds({
            mesh: this.mesh,
            dppName: this.dppName,
          })
        } else if (this.zoneIngressName !== '') {
          xds = await Kuma.getZoneIngressXds({
            zoneIngressName: this.zoneIngressName,
          })
        } else if (this.zoneEgressName !== '') {
          xds = await Kuma.getZoneEgressXds({
            zoneEgressName: this.zoneEgressName,
          })
        }

        this.xds = JSON.stringify(xds, null, 2)
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
#xds {
  max-height: 1000px;
}
</style>
