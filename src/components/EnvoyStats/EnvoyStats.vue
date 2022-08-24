<template>
  <StatusInfo
    :has-error="hasError"
    :is-loading="isLoading"
  >
    <KCard border-variant="noBorder">
      <template #body>
        <CodeBlock
          id="stats"
          language="json"
          :code="stats"
        />
      </template>
      <template #actions>
        <KClipboardProvider
          v-if="stats"
          v-slot="{ copyToClipboard }"
        >
          <KPop placement="bottom">
            <KButton
              appearance="primary"
              @click="() => { copyToClipboard(stats) }"
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
import CodeBlock from '../CodeBlock.vue'
import Kuma from '@/services/kuma'
import StatusInfo from '@/components/Utils/StatusInfo'

export default {
  name: 'EnvoyStats',
  components: {
    StatusInfo,
    CodeBlock,
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
      this.fetchStats()
    },
    zoneIngressName() {
      this.fetchStats()
    },
    zoneEgressName() {
      this.fetchStats()
    },
  },
  mounted() {
    this.fetchStats()
  },

  methods: {
    async fetchStats() {
      this.hasError = false
      this.isLoading = true

      try {
        let stats = ''

        if (this.mesh !== '' && this.dppName !== '') {
          stats = await Kuma.getDataplaneStats({
            mesh: this.mesh,
            dppName: this.dppName,
          })
        } else if (this.zoneIngressName !== '') {
          stats = await Kuma.getZoneIngressStats({
            zoneIngressName: this.zoneIngressName,
          })
        } else if (this.zoneEgressName !== '') {
          stats = await Kuma.getZoneEgressStats({
            zoneEgressName: this.zoneEgressName,
          })
        }

        this.stats = stats
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
#stats {
  max-height: 1000px;
}
</style>
