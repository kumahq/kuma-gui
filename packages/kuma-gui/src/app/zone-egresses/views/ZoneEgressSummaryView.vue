<template>
  <RouteView
    name="zone-egress-summary-view"
    :params="{
      zoneEgress: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
    v-slot="{ route, t }"
  >
    <DataCollection
      :items="props.items"
      :predicate="item => item.id === route.params.zoneEgress"
      :find="true"
    >
      <template #empty>
        <XEmptyState>
          <template #title>
            <h2>
              {{ t('common.collection.summary.empty_title', { type: 'ZoneEgress' }) }}
            </h2>
          </template>

          <p>
            {{ t('common.collection.summary.empty_message', { type: 'ZoneEgress' }) }}
          </p>
        </XEmptyState>
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
                <XAction
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
                </XAction>
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
            <div>
              <h3>
                {{ t('zone-ingresses.routes.item.config') }}
              </h3>

              <div class="mt-4">
                <ResourceCodeBlock
                  :resource="item.config"
                  is-searchable
                  :query="route.params.codeSearch"
                  :is-filter-mode="route.params.codeFilter"
                  :is-reg-exp-mode="route.params.codeRegExp"
                  @query-change="route.update({ codeSearch: $event })"
                  @filter-mode-change="route.update({ codeFilter: $event })"
                  @reg-exp-mode-change="route.update({ codeRegExp: $event })"
                  v-slot="{ copy, copying }"
                >
                  <DataSource
                    v-if="copying"
                    :src="`/zone-egresses/${route.params.zoneEgress}/as/kubernetes?no-store`"
                    @change="(data) => {
                      copy((resolve) => resolve(data))
                    }"
                    @error="(e) => {
                      copy((_resolve, reject) => reject(e))
                    }"
                  />
                </ResourceCodeBlock>
              </div>
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
import StatusBadge from '@/app/common/StatusBadge.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import ResourceCodeBlock from '@/app/x/components/x-code-block/ResourceCodeBlock.vue'

const props = defineProps<{
  items: ZoneEgressOverview[]
}>()
</script>
<style scoped>
h2 {
  --icon-before: url('@/assets/images/icon-location-on.svg?inline') !important;
}
</style>
