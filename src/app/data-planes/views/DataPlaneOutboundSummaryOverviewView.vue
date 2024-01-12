<template>
  <RouteView
    v-slot="{ t }"
    name="data-plane-outbound-summary-overview-view"
  >
    <AppView>
      <div class="stack-with-borders">
        <DefinitionCard layout="horizontal">
          <template #title>
            Protocol
          </template>

          <template #body>
            <KBadge
              appearance="info"
            >
              {{ t(`http.api.value.${props.data.protocol}`) }}
            </KBadge>
          </template>
        </DefinitionCard>
      </div>
    </AppView>
  </RouteView>
</template>
<script lang="ts" setup>
import type { TrafficEntry } from '../data'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
const props = defineProps<{
  data: TrafficEntry
}>()
</script>
