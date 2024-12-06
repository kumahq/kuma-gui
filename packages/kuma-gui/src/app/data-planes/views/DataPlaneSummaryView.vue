<template>
  <RouteView
    :name="props.routeName"
    :params="{
      mesh: '',
      dataPlane: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
    v-slot="{ route, t, uri }"
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

            <XLayout type="stack">
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
                    <div
                      class="status-with-reason"
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
                        <KTooltip
                          class="reason-tooltip"
                        >
                          <InfoIcon
                            :color="KUI_COLOR_BACKGROUND_NEUTRAL"
                            :size="KUI_ICON_SIZE_30"
                          />
                          <template #content>
                            <ul>
                              <li
                                v-for="inbound in inbounds"
                                :key="`${inbound.service}:${inbound.port}`"
                              >
                                {{ t('data-planes.routes.item.unhealthy_inbound', { service: inbound.service, port: inbound.port }) }}
                              </li>
                            </ul>
                          </template>
                        </KTooltip>
                      </DataCollection>
                    </div>
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

              <div
                v-if="item.dataplane.networking.gateway"
              >
                <h3>{{ t('data-planes.routes.item.gateway') }}</h3>

                <div
                  class="mt-4"
                >
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
                        <TextWithCopyButton
                          :text="`${item.dataplane.networking.address}`"
                        />
                      </template>
                    </DefinitionCard>
                  </div>
                </div>
              </div>
            </XLayout>

            <div>
              <h3>
                {{ t('data-planes.routes.item.config') }}
              </h3>

              <div class="mt-4">
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
              </div>
            </div>
          </AppView>
        </template>
      </template>
    </DataCollection>
  </RouteView>
</template>

<script lang="ts" setup>
import { KUI_COLOR_BACKGROUND_NEUTRAL, KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { InfoIcon } from '@kong/icons'

import { DataplaneOverview } from '../data'
import { sources } from '../sources'
import { useCan } from '@/app/application'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import TagList from '@/app/common/TagList.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import ResourceCodeBlock from '@/app/x/components/x-code-block/ResourceCodeBlock.vue'

const can = useCan()

const props = defineProps<{
  items: DataplaneOverview[]
  routeName: string
}>()
</script>
