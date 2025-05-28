<template>
  <RouteView
    name="mesh-service-summary-view"
    :params="{
      mesh: '',
      service: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      format: String,
    }"
    v-slot="{ route, t, can, uri }"
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
            <XLayout size="small">
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
              <XBadge
                :appearance="t(`common.status.appearance.${item.spec.state}`, undefined, { defaultMessage: 'neutral' })"
              >
                {{ t(`http.api.value.${item.spec.state}`) }}
              </XBadge>
            </XLayout>
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
                <div
                  v-for="options in [['structured', 'universal', 'k8s']]"
                  :key="typeof options"
                >
                  <XSelect
                    :label="t('services.routes.item.format')"
                    :selected="route.params.format"
                    @change="(value) => {
                      route.update({ format: value })
                    }"
                    @vue:before-mount="$event?.props?.selected && options.includes($event.props.selected) && $event.props.selected !== route.params.format && route.update({ format: $event.props.selected })"
                  >
                    <template
                      v-for="value in options"
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
                <DefinitionCard layout="horizontal">
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
                        v-for="(value, key) in item.spec.selector.dataplaneTags"
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
            
            <template v-else-if="route.params.format === 'universal'">
              <ResourceCodeBlock
                data-testid="codeblock-yaml-universal"
                language="yaml"
                :resource="item.config"
                :show-k8s-copy-button="false"
                is-searchable
                :query="route.params.codeSearch"
                :is-filter-mode="route.params.codeFilter"
                :is-reg-exp-mode="route.params.codeRegExp"
                @query-change="route.update({ codeSearch: $event })"
                @filter-mode-change="route.update({ codeFilter: $event })"
                @reg-exp-mode-change="route.update({ codeRegExp: $event })"
              />
            </template>

            <template v-else>
              <DataLoader
                :src="uri(sources, '/meshes/:mesh/mesh-service/:name/as/kubernetes', {
                  mesh: route.params.mesh,
                  name: route.params.service,
                })"
                v-slot="{ data: k8sConfig }"
              >
                <ResourceCodeBlock
                  data-testid="codeblock-yaml-k8s"
                  language="yaml"
                  :resource="k8sConfig"
                  :show-k8s-copy-button="false"
                  is-searchable
                  :query="route.params.codeSearch"
                  :is-filter-mode="route.params.codeFilter"
                  :is-reg-exp-mode="route.params.codeRegExp"
                  @query-change="route.update({ codeSearch: $event })"
                  @filter-mode-change="route.update({ codeFilter: $event })"
                  @reg-exp-mode-change="route.update({ codeRegExp: $event })"
                />
              </DataLoader>
            </template>
          </XLayout>
        </AppView>
      </template>
    </DataCollection>
  </RouteView>
</template>

<script lang="ts" setup>
import { sources } from '../sources'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import type { MeshService } from '@/app/services/data'
import ResourceCodeBlock from '@/app/x/components/x-code-block/ResourceCodeBlock.vue'
const props = defineProps<{
  items: MeshService[]
}>()
</script>
