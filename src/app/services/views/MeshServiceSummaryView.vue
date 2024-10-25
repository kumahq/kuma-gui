<template>
  <RouteView
    name="mesh-service-summary-view"
    :params="{
      mesh: '',
      service: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
    v-slot="{ route, t, can }"
  >
    <DataCollection
      :items="props.items"
      :predicate="item => item.id === route.params.service"
    >
      <template
        #item="{ item }"
      >
        <AppView>
          <template
            #title
          >
            <h2>
              <XAction
                :to="{
                  name: 'mesh-service-detail-view',
                  params: {
                    mesh: route.params.mesh,
                    service: route.params.service,
                  },

                }"
              >
                <RouteTitle
                  :title="t('services.routes.item.title', { name: item.name })"
                />
              </XAction>
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
                <template
                  #title
                >
                  State
                </template>
                <template
                  #body
                >
                  <XBadge
                    :appearance="item.spec.state === 'Available' ? 'success' : 'danger'"
                  >
                    {{ item.spec.state }}
                  </XBadge>
                </template>
              </DefinitionCard>
              <DefinitionCard
                layout="horizontal"
              >
                <template
                  #title
                >
                  Dataplane Proxies
                </template>
                <template
                  #body
                >
                  {{ item.status.dataplaneProxies?.connected }} connected, {{ item.status.dataplaneProxies?.healthy }} healthy ({{ item.status.dataplaneProxies?.total }} total)
                </template>
              </DefinitionCard>
              <DefinitionCard
                v-if="item.namespace"
                layout="horizontal"
              >
                <template
                  #title
                >
                  Namespace
                </template>
                <template
                  #body
                >
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
                <template
                  #title
                >
                  Ports
                </template>
                <template
                  #body
                >
                  <KTruncate>
                    <KumaPort
                      v-for="connection in item.spec.ports"
                      :key="connection.port"
                      :port="{
                        ...connection,
                        targetPort: undefined,
                      }"
                    />
                  </KTruncate>
                </template>
              </DefinitionCard>
              <DefinitionCard layout="horizontal">
                <template
                  #title
                >
                  Selector
                </template>
                <template
                  #body
                >
                  <KTruncate>
                    <XBadge
                      v-for="(value, key) in item.spec.selector.dataplaneTags"
                      :key="`${key}:${value}`"
                      appearance="info"
                    >
                      {{ key }}:{{ value }}
                    </XBadge>
                  </KTruncate>
                </template>
              </DefinitionCard>
            </div>
            <div>
              <h3>
                {{ t('services.routes.item.config') }}
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
                    :src="`/meshes/${route.params.mesh}/mesh-service/${route.params.service}/as/kubernetes?no-store`"
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
          </div>
        </AppView>
      </template>
    </DataCollection>
  </RouteView>
</template>

<script lang="ts" setup>
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import type { MeshService } from '@/app/services/data'
import ResourceCodeBlock from '@/app/x/components/x-code-block/ResourceCodeBlock.vue'
const props = defineProps<{
  items: MeshService[]
}>()
</script>
