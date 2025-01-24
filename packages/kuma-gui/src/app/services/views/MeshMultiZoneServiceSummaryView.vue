<template>
  <RouteView
    name="mesh-multi-zone-service-summary-view"
    :params="{
      mesh: '',
      service: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      format: String,
    }"
    v-slot="{ route, t }"
  >
    <DataCollection
      :items="props.items"
      :predicate="item => item.id === route.params.service"
    >
      <template
        #item="{ item }"
      >
        <AppView>
          <template #title>
            <h2>
              <XAction
                :to="{
                  name: 'mesh-multi-zone-service-detail-view',
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

          <XLayout
            type="stack"
          >
            <header>
              <XLayout
                type="separated"
                size="max"
              >
                <h3>
                  {{ t('services.routes.item.config') }}
                </h3>
                <div>
                  <XSelect
                    :label="t('services.routes.item.format')"
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
                      {{ t(`services.routes.item.formats.${value}`) }}
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
                    <XLayout
                      type="separated"
                      truncate
                    >
                      <KumaPort
                        v-for="connection in item.spec.ports"
                        :key="connection.port"
                        :port="{
                          ...connection,
                          targetPort: undefined,
                        }"
                      />
                    </XLayout>
                  </template>
                </DefinitionCard>
                <DefinitionCard
                  layout="horizontal"
                >
                  <template
                    #title
                  >
                    Selector
                  </template>
                  <template
                    #body
                  >
                    <XLayout
                      type="separated"
                      truncate
                    >
                      <XBadge
                        v-for="(value, key) in item.spec.selector.meshService.matchLabels"
                        :key="`${key}:${value}`"
                        appearance="info"
                      >
                        {{ key }}:{{ value }}
                      </XBadge>
                    </XLayout>
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
                    :src="`/meshes/${route.params.mesh}/mesh-multi-zone-service/${route.params.service}/as/kubernetes?no-store`"
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
    </DataCollection>
  </RouteView>
</template>

<script lang="ts" setup>
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import type { MeshMultiZoneService } from '@/app/services/data'
import ResourceCodeBlock from '@/app/x/components/x-code-block/ResourceCodeBlock.vue'
const props = defineProps<{
  items: MeshMultiZoneService[]
}>()
</script>
