<template>
  <RouteView
    :name="props.routeName"
    :params="{
      mesh: '',
      gateway: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      format: String,
    }"
    v-slot="{ route, t }"
  >
    <DataCollection
      :items="props.items"
      :predicate="item => item.id === route.params.gateway"
      :find="true"
    >
      <template #empty>
        <XEmptyState>
          <template #title>
            <h2>
              {{ t('common.collection.summary.empty_title', { type: 'Gateway' }) }}
            </h2>
          </template>
          <p>
            {{ t('common.collection.summary.empty_message', { type: 'Gateway' }) }}
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
                    name: 'builtin-gateway-detail-view',
                    params: {
                      mesh: item.mesh,
                      gateway: item.id,
                    },
                  }"
                >
                  <RouteTitle
                    :title="t('builtin-gateways.routes.item.title', { name: item.name })"
                  />
                </XAction>
              </h2>
            </template>
            <XLayout type="stack">
              <header>
                <XLayout
                  type="separated"
                  size="max"
                >
                  <h3>
                    {{ t('gateways.routes.item.config') }}
                  </h3>
                  <div>
                    <XSelect
                      :label="t('gateways.routes.item.format')"
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
                        {{ t(`gateways.routes.item.formats.${value}`) }}
                      </template>
                    </XSelect>
                  </div>
                </XLayout>
              </header>

              <template v-if="route.params.format === 'structured'">
                <div
                  class="stack-with-borders"
                  data-testid="structured-view"
                >
                  <DefinitionCard
                    v-if="item.namespace.length > 0"
                    layout="horizontal"
                  >
                    <template #title>
                      {{ t('gateways.routes.item.namespace') }}
                    </template>

                    <template #body>
                      {{ item.namespace }}
                    </template>
                  </DefinitionCard>
                </div>
              </template>
              <template v-else>
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
                      :src="`/meshes/${route.params.mesh}/mesh-gateways/${route.params.gateway}/as/kubernetes?no-store`"
                      @change="(data) => {
                        copy((resolve) => resolve(data))
                      }"
                      @error="(e) => {
                        copy((_resolve, reject) => reject(e))
                      }"
                    />
                  </ResourceCodeBlock>
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
import type { MeshGateway } from '../data'
import DataCollection from '@/app/application/components/data-collection/DataCollection.vue'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import ResourceCodeBlock from '@/app/x/components/x-code-block/ResourceCodeBlock.vue'

const props = defineProps<{
  items: MeshGateway[]
  routeName: string
}>()
</script>
<style scoped>
h2 {
  --icon-before: url('@/assets/images/gateway.svg?inline') !important;
}
</style>
