<template>
  <div data-testid="entity-url-control">
    <KClipboardProvider v-slot="{ copyToClipboard }">
      <KPop placement="bottom">
        <KButton
          appearance="outline"
          size="small"
          @click="() => { copyToClipboard(shareUrl) }"
        >
          <template #icon>
            <KIcon icon="externalLink" />
          </template>
          {{ copyButtonText }}
        </KButton>
        <template #content>
          <div>
            <p>{{ confirmationText }}</p>
          </div>
        </template>
      </KPop>
    </KClipboardProvider>
  </div>
</template>

<script>
export default {
  name: 'EntityURLControl',
  props: {
    name: {
      type: String,
      default: '',
    },
    copyButtonText: {
      type: String,
      default: 'Copy URL',
    },
    confirmationText: {
      type: String,
      default: 'URL copied to clipboard!',
    },
    mesh: {
      type: String,
      default: '',
    },
  },
  computed: {
    shareUrl() {
      const urlRoot = `${window.location.href.replace(window.location.hash, '')}#`

      const { fullPath } = this.$router.resolve({
        name: this.$route.name,
        params: { mesh: this.mesh },
        query: { ns: this.name },
      }).resolved

      return `${urlRoot}${fullPath}`
    },
  },
}
</script>
