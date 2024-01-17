<template>
  <RouteView
    v-slot="{ t }"
    name="data-plane-inbound-summary-overview-view"
  >
    <AppView>
      <div class="stack-with-borders">
        <DefinitionCard layout="horizontal">
          <template #title>
            Tags
          </template>

          <template #body>
            <TagList
              :tags="props.data.tags"
              alignment="right"
            />
          </template>
        </DefinitionCard>
        <DefinitionCard layout="horizontal">
          <template #title>
            Status
          </template>

          <template #body>
            <KBadge
              :appearance="props.data.health.ready ? 'success' : 'danger'"
            >
              {{ props.data.health.ready ? 'Healthy' : 'Unhealthy' }}
            </KBadge>
          </template>
        </DefinitionCard>
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
        <DefinitionCard layout="horizontal">
          <template #title>
            Address
          </template>

          <template #body>
            <TextWithCopyButton
              :text="`${props.data.addressPort}`"
            />
          </template>
        </DefinitionCard>
        <DefinitionCard layout="horizontal">
          <template #title>
            Service Address
          </template>

          <template #body>
            <TextWithCopyButton
              :text="`${props.data.serviceAddressPort}`"
            />
          </template>
        </DefinitionCard>
      </div>
    </AppView>
  </RouteView>
</template>
<script lang="ts" setup>
import type { DataplaneInbound } from '../data'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import TagList from '@/app/common/TagList.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
const props = defineProps<{
  data: DataplaneInbound
}>()
</script>
