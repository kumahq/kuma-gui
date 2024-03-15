<template>
  <RouteView
    v-slot="{ t }"
    name="connection-outbound-summary-overview-view"
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
              {{ t(`http.api.value.${['grpc', 'http', 'tcp'].find(protocol => typeof props.data[protocol] !== 'undefined')}`) }}
            </KBadge>
          </template>
        </DefinitionCard>
      </div>
    </AppView>
  </RouteView>
</template>
<script lang="ts" setup>
import DefinitionCard from '@/app/common/DefinitionCard.vue'
const props = defineProps<{
  data: Record<string, any>
}>()
</script>
