<template>
  <RouteView
    :name="props.routeName"
    :params="{
      mesh: '',
      dataPlane: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      format: String,
    }"
    v-slot="{ route, t, uri, can }"
  >
    <DataCollection
      :items="props.items"
      :predicate="item => item.id === route.params.dataPlane"
    >
      <template #empty>
        <XEmptyState>
          <template #title>
            <h2>
              {{ t('common.collection.summary.empty_title', { type: 'Data Plane Proxy' }) }}
            </h2>
          </template>
          <p>
            {{ t('common.collection.summary.empty_message', { type: 'Data Plane Proxy' }) }}
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
              <h2
                :class="`type-${item.dataplaneType}`"
              >
                <XAction
                  :to="{
                    name: 'data-plane-detail-view',
                    params: {
                      dataPlane: item.id,
                    },
                  }"
                >
                  <RouteTitle
                    :title="t('data-planes.routes.item.title', { name: item.name })"
                  />
                </XAction>
              </h2>
            </template>

            <XLayout>
              <header>
                <XLayout
                  type="separated"
                  size="max"
                >
                  <h3>
                    {{ t('data-planes.routes.item.config') }}
                  </h3>
                  <div>
                    <XSelect
                      :label="t('data-planes.routes.item.format')"
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
                        {{ t(`data-planes.routes.item.formats.${value}`) }}
                      </template>
                    </XSelect>
                  </div>
                </XLayout>
              </header>
            </XLayout>

            <template v-if="route.params.format === 'structured'">
              <XLayout
                type="stack"
                data-testid="structured-view"
              >
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
                      <XLayout
                        type="separated"
                      >
                        <StatusBadge
                          :status="item.status"
                        />

                        <DataCollection
                          v-if="item.dataplaneType === 'standard'"
                          :items="item.dataplane.networking.inbounds"
                          :predicate="item => item.state !== 'Ready'"
                          :empty="false"
                          v-slot="{ items : inbounds }"
                        >
                          <XIcon
                            name="info"
                            :color="KUI_COLOR_TEXT_NEUTRAL"
                          >
                            <ul>
                              <li
                                v-for="inbound in inbounds"
                                :key="`${inbound.service}:${inbound.port}`"
                              >
                                {{ t('data-planes.routes.item.unhealthy_inbound', { service: inbound.service, port: inbound.port }) }}
                              </li>
                            </ul>
                          </XIcon>
                        </DataCollection>
                      </XLayout>
                    </template>
                  </DefinitionCard>

                  <DefinitionCard
                    layout="horizontal"
                  >
                    <template #title>
                      Type
                    </template>

                    <template #body>
                      {{ t(`data-planes.type.${item.dataplaneType}`) }}
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
                    v-if="can('use zones') && item.zone"
                    layout="horizontal"
                  >
                    <template
                      #title
                    >
                      Zone
                    </template>
                    <template
                      #body
                    >
                      <XAction
                        :to="{
                          name: 'zone-cp-detail-view',
                          params: {
                            zone: item.zone,
                          },
                        }"
                      >
                        {{ item.zone }}
                      </XAction>
                    </template>
                  </DefinitionCard>
                  <DefinitionCard
                    layout="horizontal"
                  >
                    <template #title>
                      {{ t('http.api.property.modificationTime') }}
                    </template>

                    <template #body>
                      {{ t('common.formats.datetime', { value: Date.parse(item.modificationTime) }) }}
                    </template>
                  </DefinitionCard>
                </div>

                <XLayout
                  v-if="item.dataplane.networking.gateway"
                  type="stack"
                >
                  <h3>{{ t('data-planes.routes.item.gateway') }}</h3>

                  <div
                    class="stack-with-borders"
                  >
                    <DefinitionCard
                      layout="horizontal"
                    >
                      <template #title>
                        {{ t('http.api.property.tags') }}
                      </template>

                      <template #body>
                        <TagList
                          alignment="right"
                          :tags="item.dataplane.networking.gateway.tags"
                        />
                      </template>
                    </DefinitionCard>

                    <DefinitionCard
                      layout="horizontal"
                    >
                      <template #title>
                        {{ t('http.api.property.address') }}
                      </template>

                      <template #body>
                        <XCopyButton
                          :text="`${item.dataplane.networking.address}`"
                        />
                      </template>
                    </DefinitionCard>
                  </div>
                </XLayout>
              </XLayout>
            </template>

            <template v-else>
              <XLayout
                type="stack"
              >
                <ResourceCodeBlock
                  :resource="item.config"
                  language="yaml"
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
                    :src="uri(sources, `/meshes/:mesh/dataplanes/:name/as/kubernetes`, {
                      mesh: route.params.mesh,
                      name: route.params.dataPlane,
                    }, {
                      cacheControl: 'no-store',
                    })"
                    @change="(data) => {
                      copy((resolve) => resolve(data))
                    }"
                    @error="(e) => {
                      copy((_resolve, reject) => reject(e))
                    }"
                  />
                </ResourceCodeBlock>
              </XLayout>
            </template>
          </AppView>
        </template>
      </template>
    </DataCollection>
  </RouteView>
</template>

<script lang="ts" setup>
import { KUI_COLOR_TEXT_NEUTRAL } from '@kong/design-tokens'

import { DataplaneOverview } from '../data'
import { sources } from '../sources'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import TagList from '@/app/common/TagList.vue'
import ResourceCodeBlock from '@/app/x/components/x-code-block/ResourceCodeBlock.vue'

const props = defineProps<{
  items: DataplaneOverview[]
  routeName: string
}>()
</script>
