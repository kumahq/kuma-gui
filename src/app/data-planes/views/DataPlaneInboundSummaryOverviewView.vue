<template>
  <RouteView
    v-slot="{ t }"
    name="data-plane-inbound-summary-overview-view"
  >
    <AppView>
      <div
        v-if="props.gateway"
        class="stack-with-borders"
      >
        <DefinitionCard layout="horizontal">
          <template #title>
            Tags
          </template>

          <template #body>
            <TagList
              :tags="props.gateway.tags"
              alignment="right"
              :dataplane-type="props.dataplaneType"
            />
          </template>
        </DefinitionCard>
      </div>

      <div
        v-else-if="props.inbound"
        class="stack-with-borders"
      >
        <DefinitionCard layout="horizontal">
          <template #title>
            Tags
          </template>

          <template #body>
            <TagList
              :tags="props.inbound.tags"
              alignment="right"
              :dataplane-type="props.dataplaneType"
            />
          </template>
        </DefinitionCard>
        <DefinitionCard layout="horizontal">
          <template #title>
            Status
          </template>

          <template #body>
            <KBadge
              :appearance="props.inbound.health.ready ? 'success' : 'danger'"
            >
              {{ props.inbound.health.ready ? 'Healthy' : 'Unhealthy' }}
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
              {{ t(`http.api.value.${props.inbound.protocol}`) }}
            </KBadge>
          </template>
        </DefinitionCard>
        <DefinitionCard layout="horizontal">
          <template #title>
            Address
          </template>

          <template #body>
            <TextWithCopyButton
              :text="`${props.inbound.addressPort}`"
            />
          </template>
        </DefinitionCard>
        <DefinitionCard layout="horizontal">
          <template #title>
            Service Address
          </template>

          <template #body>
            <TextWithCopyButton
              :text="`${props.inbound.serviceAddressPort}`"
            />
          </template>
        </DefinitionCard>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { DataplaneGateway, DataplaneInbound } from '../data'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import TagList from '@/app/common/TagList.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'

const props = defineProps<{
  dataplaneType: 'standard' | 'builtin'
  inbound?: DataplaneInbound
  gateway?: DataplaneGateway
}>()
</script>
