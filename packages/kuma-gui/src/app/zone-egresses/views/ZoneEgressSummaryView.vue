<template>
  <RouteView
    name="zone-egress-summary-view"
    :params="{
      proxy: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      format: 'structured',
    }"
    v-slot="{ route, t }"
  >
    <DataCollection
      :items="props.items"
      :predicate="item => item.id === route.params.proxy"
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
                      proxyType: 'egresses',
                      proxy: item.id,
                    },
                  }"
                >
                  <RouteTitle
                    :title="t('zone-egresses.routes.item.title', { name: item.name })"
                  />
                </XAction>
              </h2>
            </template>

            <XLayout
              type="stack"
            >
              <header>
                <XLayout
                  type="separated"
                  size="max"
                >
                  <h3>
                    {{ t('zone-ingresses.routes.item.config') }}
                  </h3>
                  <div>
                    <XSelect
                      :label="t('zone-ingresses.routes.items.format')"
                      :selected="route.params.format"
                      @change="(value) => {
                        route.update({ format: value })
                      }"
                    >
                      <template
                        v-for="value in ['structured', 'yaml']"
                        :key="value"
                        #[`${value}-option`]
                      >
                        {{ t(`zone-ingresses.routes.items.formats.${value}`) }}
                      </template>
                    </XSelect>
                  </div>
                </XLayout>
              </header>
              <template v-if="route.params.format === 'structured'">
                <XLayout
                  type="stack"
                  class="stack-with-borders"
                  data-testid="structured-view"
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
                        <XCopyButton
                          :text="item.zoneEgress.socketAddress"
                        />
                      </template>

                      <template v-else>
                        {{ t('common.detail.none') }}
                      </template>
                    </template>
                  </DefinitionCard>
                </XLayout>
              </template>
              <template v-else>
                <div>
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
                        :src="`/zone-egresses/${route.params.proxy}/as/kubernetes?no-store`"
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
              </template>
            </XLayout>
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
