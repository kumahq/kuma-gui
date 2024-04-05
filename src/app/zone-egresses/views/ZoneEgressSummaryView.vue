<template>
  <RouteView
    v-slot="{ route, t }"
    name="zone-egress-summary-view"
    :params="{
      zoneEgress: '',
    }"
  >
    <DataCollection
      :items="props.items"
      :predicate="item => item.id === route.params.zoneEgress"
      :find="true"
    >
      <template #empty>
        <EmptyBlock>
          <template #title>
            {{ t('common.collection.summary.empty_title', { type: 'ZoneEgress' }) }}
          </template>

          <p>{{ t('common.collection.summary.empty_message', { type: 'ZoneEgress' }) }}</p>
        </EmptyBlock>
      </template>
      <template
        #default="{ items: proxies }"
      >
        <template
          v-for="item in [proxies[0]]"
          :key="item.id"
        >
          <AppView>
            <template #title>
              <h2>
                <RouterLink
                  :to="{
                    name: 'zone-egress-detail-view',
                    params: {
                      zone: item.zoneEgress.zone,
                      zoneEgress: item.id,
                    },
                  }"
                >
                  <RouteTitle
                    :title="t('zone-egresses.routes.item.title', { name: item.name })"
                  />
                </RouterLink>
              </h2>
            </template>

            <div
              class="stack-with-borders"
            >
              <DefinitionCard
                layout="horizontal"
              >
                <template #title>
                  {{ t('http.api.property.status') }}
                </template>

                <template #body>
                  <StatusBadge
                    :status="item.state"
                  />
                </template>
              </DefinitionCard>

              <DefinitionCard
                v-if="item.namespace.length > 0"
                layout="horizontal"
              >
                <template #title>
                  {{ t('data-planes.routes.item.namespace') }}
                </template>

                <template #body>
                  {{ item.namespace }}
                </template>
              </DefinitionCard>

              <DefinitionCard
                layout="horizontal"
              >
                <template #title>
                  {{ t('http.api.property.address') }}
                </template>

                <template #body>
                  <template
                    v-if="item.zoneEgress.socketAddress.length > 0"
                  >
                    <TextWithCopyButton
                      :text="item.zoneEgress.socketAddress"
                    />
                  </template>

                  <template v-else>
                    {{ t('common.detail.none') }}
                  </template>
                </template>
              </DefinitionCard>
            </div>
          </AppView>
        </template>
      </template>
    </DataCollection>
  </RouteView>
</template>

<script lang="ts" setup>
import type { ZoneEgressOverview } from '../data'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'

const props = defineProps<{
  items: ZoneEgressOverview[]
}>()
</script>
<style scoped>
h2 {
  --icon-before: url('@/assets/images/icon-location-on.svg?inline') !important;
}
</style>
