<template>
  <StatusInfo
    class="envoy-data"
    :has-error="error !== null"
    :is-loading="isLoading"
    :error="error"
  >
    <CodeBlock
      :id="`code-block-${dataPath}`"
      language="json"
      :code="content"
      is-searchable
      :query-key="queryKey ?? `code-block-${dataPath}`"
    />
  </StatusInfo>
</template>

<script>
import Kuma from '@/services/kuma'
import CodeBlock from '@/app/common/CodeBlock.vue'
import StatusInfo from '@/components/Utils/StatusInfo.vue'

export default {
  name: 'EnvoyData',

  components: {
    CodeBlock,
    StatusInfo,
  },

  props: {
    dataPath: {
      type: String,
      required: true,
    },

    queryKey: {
      type: String,
      required: false,
      default: null,
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

<style lang="scss">
.code-container .k-card-body {
  position: relative;
}
</style>

<style lang="scss" scoped>
.envoy-data {
  padding: var(--spacing-md);
}

.copy-button {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  display: block;
}
</style>
