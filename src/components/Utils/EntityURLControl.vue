<template>
  <div data-testid="entity-url-control">
    <KClipboardProvider v-slot="{ copyToClipboard }">
      <KPop placement="bottom">
        <KButton
          appearance="outline"
          icon="copy"
          size="small"
          @click="() => { copyToClipboard(shareUrl) }"
        >
          Copy URL
        </KButton>

        <template #content>
          <p>URL copied to clipboard!</p>
        </template>
      </KPop>
    </KClipboardProvider>
  </div>
</template>

<script>
import { KClipboardProvider, KPop, KButton } from '@kong/kongponents'

export default {
  name: 'EntityURLControl',

  components: {
    KClipboardProvider,
    KPop,
    KButton,
  },

  props: {
    name: {
      type: String,
      default: '',
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
