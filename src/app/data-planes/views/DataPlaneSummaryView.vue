<template>
  <RouteView
    name="data-plane-summary-view"
    :params="{
      dataPlane: '',
    }"
    v-slot="{ t, route }"
  >
    <DataCollection
      :items="props.items"
      :predicate="item => item.id === route.params.dataPlane"
      :find="true"
    >
      <template #empty>
        <EmptyBlock>
          <template #title>
            {{ t('common.collection.summary.empty_title', { type: 'Data Plane Proxy' }) }}
          </template>

          <p>{{ t('common.collection.summary.empty_message', { type: 'Data Plane Proxy' }) }}</p>
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
              <h2
                :class="`type-${item.dataplaneType}`"
              >
                <RouterLink
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
                </RouterLink>
              </h2>
            </template>

            <div
              class="stack"
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
                    <div
                      class="status-with-reason"
                    >
                      <StatusBadge
                        :status="item.status"
                      />
                      <DataCollection
                        v-if="item.dataplaneType === 'standard'"
                        :items="item.dataplane.networking.inbounds"
                        :predicate="item => !item.health.ready"
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
                  layout="horizontal"
                >
                  <template #title>
                    {{ t('data-planes.routes.item.last_updated') }}
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

              <DataCollection
                v-if="item.dataplaneType === 'standard'"
                :items="item.dataplane.networking.inbounds"
                v-slot="{ items : inbounds }"
              >
                <div>
                  <h3>{{ t('data-planes.routes.item.inbounds') }}</h3>

                  <div
                    class="mt-4 stack"
                  >
                    <div
                      v-for="(inbound, index) in inbounds"
                      :key="index"
                      class="inbound"
                    >
                      <h4>
                        <TextWithCopyButton
                          :text="inbound.tags['kuma.io/service']"
                        >
                          {{ t('data-planes.routes.item.inbound_name', { service: inbound.tags['kuma.io/service'] }) }}
                        </TextWithCopyButton>
                      </h4>

                      <div
                        class="mt-2 stack-with-borders"
                      >
                        <DefinitionCard
                          layout="horizontal"
                        >
                          <template #title>
                            {{ t('http.api.property.status') }}
                          </template>

                          <template #body>
                            <KBadge
                              v-if="inbound.health.ready"
                              appearance="success"
                            >
                              {{ t('data-planes.routes.item.health.ready') }}
                            </KBadge>

                            <KBadge
                              v-else
                              appearance="danger"
                            >
                              {{ t('data-planes.routes.item.health.not_ready') }}
                            </KBadge>
                          </template>
                        </DefinitionCard>

                        <DefinitionCard
                          layout="horizontal"
                        >
                          <template #title>
                            {{ t('http.api.property.tags') }}
                          </template>

                          <template #body>
                            <TagList
                              alignment="right"
                              :tags="inbound.tags"
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
                            <TextWithCopyButton :text="inbound.addressPort" />
                          </template>
                        </DefinitionCard>
                      </div>
                    </div>
                  </div>
                </div>
              </DataCollection>
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

import type { DataplaneOverview } from '../data'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import TagList from '@/app/common/TagList.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'

const props = defineProps<{
  items: DataplaneOverview[]
}>()
</script>
<style lang="scss" scoped>
h2.type-standard {
  --icon-before: url('@/assets/images/east-west.svg') !important;
}
h2.type-builtin,
h2.type-delegated {
  --icon-before: url('@/assets/images/portal.svg') !important;
}

.status-with-reason {
  display: flex;
  align-items: center;
  gap: $kui-space-50;
}

.reason-tooltip :deep(.kong-icon) {
  display: flex;
  align-items: center;
}
</style>
