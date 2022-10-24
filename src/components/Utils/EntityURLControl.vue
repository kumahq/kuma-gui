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

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { KClipboardProvider, KPop, KButton } from '@kong/kongponents'

const route = useRoute()
const router = useRouter()

const props = defineProps({
  name: {
    type: String,
    required: false,
    default: '',
  },

  mesh: {
    type: String,
    required: false,
    default: '',
  },

  route: {
    type: Object,
    required: false,
    default: null,
  },
})

const shareUrl = computed(() => {
  const urlRoot = `${window.location.href.replace(window.location.hash, '')}#`
  const shareRoute = props.route !== null
    ? props.route
    : {
      name: route.name,
      params: { mesh: props.mesh },
      query: { ns: props.name },
    }
  const resolvedRoute = router.resolve(shareRoute)

  return `${urlRoot}${resolvedRoute.fullPath}`
})
</script>
