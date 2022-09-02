<template>
  <StatusInfo
    :has-error="error !== null"
    :is-loading="isLoading"
    :error="error"
  >
    <KCard border-variant="noBorder">
      <template #body>
        <CodeBlock
          class="panel-code-block"
          language="json"
          :code="content"
        />
      </template>

      <template #actions>
        <KClipboardProvider
          v-if="content"
          v-slot="{ copyToClipboard }"
        >
          <KPop placement="bottom">
            <KButton
              appearance="primary"
              @click="copyToClipboard(content)"
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
    </KCard>
  </StatusInfo>
</template>

<script>
import { KButton, KCard, KClipboardProvider, KPop } from '@kong/kongponents'

import CodeBlock from '../CodeBlock.vue'
import Kuma from '@/services/kuma'
import StatusInfo from '@/components/Utils/StatusInfo.vue'

export default {
  name: 'EnvoyData',

  components: {
    CodeBlock,
    KButton,
    KCard,
    KClipboardProvider,
    KPop,
    StatusInfo,
  },

  props: {
    dataPath: {
      type: String,
      required: true,
    },

    mesh: {
      type: String,
      required: false,
      default: '',
    },

    dppName: {
      type: String,
      required: false,
      default: '',
    },

    zoneIngressName: {
      type: String,
      required: false,
      default: '',
    },

    zoneEgressName: {
      type: String,
      required: false,
      default: '',
    },
  },

  data() {
    return {
      isLoading: true,
      error: null,
    }
  },

  watch: {
    dppName() {
      this.fetchContent()
    },

    zoneIngressName() {
      this.fetchContent()
    },

    zoneEgressName() {
      this.fetchContent()
    },
  },

  mounted() {
    this.fetchContent()
  },

  methods: {
    async fetchContent() {
      this.error = null
      this.isLoading = true

      try {
        let content = ''

        if (this.mesh !== '' && this.dppName !== '') {
          content = await Kuma.getDataplaneData({
            dataPath: this.dataPath,
            mesh: this.mesh,
            dppName: this.dppName,
          })
        } else if (this.zoneIngressName !== '') {
          content = await Kuma.getZoneIngressData({
            dataPath: this.dataPath,
            zoneIngressName: this.zoneIngressName,
          })
        } else if (this.zoneEgressName !== '') {
          content = await Kuma.getZoneEgressData({
            dataPath: this.dataPath,
            zoneEgressName: this.zoneEgressName,
          })
        }

        this.content = typeof content === 'string' ? content : JSON.stringify(content, null, 2)
      } catch (error) {
        this.error = error
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.panel-code-block {
  max-height: 1000px;
}
</style>
