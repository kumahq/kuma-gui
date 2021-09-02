<template>
  <div class="entity-url-control">
    <KClipboardProvider
      v-if="shouldDisplay"
      v-slot="{ copyToClipboard }"
    >
      <KPop placement="bottom">
        <KButton
          appearance="secondary"
          size="small"
          @click="() => { copyToClipboard(url) }"
        >
          <template v-slot:icon>
            <KIcon
              view-box="0 0 16 16"
              icon="externalLink"
            />
            {{ copyButtonText }}
          </template>
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

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'EntityURLControl',
  props: {
    url: {
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
    shouldDisplay(): boolean {
      const mesh = this.$route.params.mesh || null

      // we only want to display the copy button when the user has filtered
      // the view by mesh and not all meshes
      if (mesh && mesh !== 'all') {
        return true
      }

      return false
    },
  },
})
</script>
