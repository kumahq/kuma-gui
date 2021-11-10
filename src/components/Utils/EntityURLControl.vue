<template>
  <div
    v-if="shouldDisplay"
    data-testid="entity-url-control"
  >
    <KClipboardProvider v-slot="{ copyToClipboard }">
      <KPop placement="bottom">
        <KButton
          appearance="secondary"
          size="small"
          @click="() => { copyToClipboard(shareUrl) }"
        >
          <template v-slot:icon>
            <KIcon
              view-box="0 0 16 16"
              icon="externalLink"
            />
          </template>
          {{ copyButtonText }}
        </KButton>
        <template v-slot:content>
          <div>
            <p>{{ confirmationText }}</p>
          </div>
        </template>
      </KPop>
    </KClipboardProvider>
  </div>
</template>

<script >
export default {
  name: 'EntityURLControl',
  props: {
    name: {
      type: String,
      required: true,
    },
    copyButtonText: {
      type: String,
      default: 'Copy URL',
    },
    confirmationText: {
      type: String,
      default: 'URL copied to clipboard!',
    },
  },
  computed: {
    shareUrl() {
      const urlRoot = `${window.location.href.replace(window.location.hash, '')}#`

      return `${urlRoot}${this.$route.fullPath}?ns=${this.name}`
    },
    shouldDisplay() {
      const mesh = this.$route.params.mesh || null

      // we only want to display the copy button when the user has filtered
      // the view by mesh and not all meshes
      if (mesh && mesh !== 'all') {
        return true
      }

      return false
    },
  },
}
</script>
