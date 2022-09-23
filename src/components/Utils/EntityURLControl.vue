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
import { KClipboardProvider, KPop, KButton, KIcon } from '@kong/kongponents'

export default {
  name: 'EntityURLControl',

  components: {
    KClipboardProvider,
    KPop,
    KButton,
    KIcon,
  },

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
    route: {
      type: Object,
      required: false,
      default: null,
    },
  },
  computed: {
    shareUrl() {
      const urlRoot = `${window.location.href.replace(window.location.hash, '')}#`

      const route = this.route !== null
        ? this.route
        : {
          name: this.$route.name,
          params: { mesh: this.mesh },
          query: { ns: this.name },
        }

      const { fullPath } = this.$router.resolve(route)

      return `${urlRoot}${fullPath}`
    },
  },
}
</script>
