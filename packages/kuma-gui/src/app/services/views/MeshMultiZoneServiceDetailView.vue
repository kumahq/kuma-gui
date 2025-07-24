<template>
  <RouteView
    name="mesh-multi-zone-service-detail-view"
    :params="{
      mesh: '',
      service: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      environment: String,
    }"
    v-slot="{ route, t, uri, me }"
  >
    <AppView>
      <XLayout type="stack">
        <XAboutCard
          :title="t('services.mesh-multi-zone-service.about.title')"
          :created="props.data.creationTime"
          :modified="props.data.modificationTime"
        >
          <DefinitionCard layout="horizontal">
            <template
              #title
            >
              {{ t('http.api.property.ports') }}
            </template>
            <template #body>
              <template v-if="props.data.spec.ports.length">
                <XLayout
                  type="separated"
                  truncate
                >
                  <KumaPort
                    v-for="connection in props.data.spec.ports"
                    :key="connection.port"
                    :port="{
                      ...connection,
                      targetPort: undefined,
                    }"
                  />
                </XLayout>
              </template>
              <template v-else>
                {{ t('common.detail.none') }}
              </template>
            </template>
          </DefinitionCard>
          <DefinitionCard layout="horizontal">
            <template
              #title
            >
              {{ t('http.api.property.selector') }}
            </template>
            <template
              #body
            >
              <template v-if="Object.keys(data.spec.selector.meshService.matchLabels ?? {}).length">
                <XLayout
                  type="separated"
                  truncate
                >
                  <XBadge
                    v-for="(value, key) in data.spec.selector.meshService.matchLabels"
                    :key="`${key}:${value}`"
                    appearance="info"
                  >
                    {{ key }}:{{ value }}
                  </XBadge>
                </XLayout>
              </template>
              <template v-else>
                {{ t('common.detail.none') }}
              </template>
            </template>
          </DefinitionCard>
        </XAboutCard>

        <XCard>
          <template #title>
            {{ t('services.detail.hostnames.title') }}
          </template>

          <DataLoader
            :src="uri(servicesSources, '/meshes/:mesh/:serviceType/:serviceName/_hostnames', {
              mesh: route.params.mesh,
              serviceType: 'meshmultizoneservices',
              serviceName: route.params.service,
            })"
            variant="list"
            v-slot="{ data: hostnames }"
          >
            <DataCollection
              type="hostnames"
              :items="hostnames.items"
            >
              <AppCollection
                type="hostnames-collection"
                data-testid="hostnames-collection"
                :items="hostnames.items"
                :headers="[
                  { ...me.get('headers.hostname'), label: t('services.detail.hostnames.hostname'), key: 'hostname' },
                  { ...me.get('headers.zones'), label: t('services.detail.hostnames.zone'), key: 'zones' },
                ]"
                @resize="me.set"
              >
                <template #hostname="{ row: item }">
                  <b>
                    <XCopyButton
                      :text="item.hostname"
                    />
                  </b>
                </template>
                <template #zones="{ row: item }">
                  <XLayout type="separated">
                    <XBadge
                      v-for="(zone, index) of item.zones"
                      :key="index"
                      appearance="decorative"
                    >
                      <XAction
                        :to="{
                          name: 'zone-cp-detail-view',
                          params: {
                            zone: zone.name,
                          },
                        }"
                      >
                        {{ zone.name }}
                      </XAction>
                    </XBadge>
                  </XLayout>
                </template>
              </AppCollection>
            </DataCollection>
          </DataLoader>
        </XCard>

        <XCard>
          <XLayout>
            <XLayout
              type="separated"
              justify="end"
            >
              <div
                v-for="options in [['universal', 'k8s']]"
                :key="typeof options"
              >
                <XSelect
                  :label="t('services.routes.item.format')"
                  :selected="route.params.environment"
                  @change="(value) => {
                    route.update({ environment: value })
                  }"
                  @vue:before-mount="$event?.props?.selected && options.includes($event.props.selected) && $event.props.selected !== route.params.environment && route.update({ environment: $event.props.selected })"
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

            <template v-if="route.params.environment === 'universal'">
              <XCodeBlock
                data-testid="codeblock-yaml-universal"
                language="yaml"
                :code="YAML.stringify(props.data.config)"
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
                :src="`/meshes/${props.data.mesh}/mesh-multi-zone-service/${props.data.id}/as/kubernetes`"
                v-slot="{ data: k8sConfig }"
              >
                <XCodeBlock
                  data-testid="codeblock-yaml-k8s"
                  language="yaml"
                  :code="YAML.stringify(k8sConfig)"
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
        </XCard>
      </XLayout>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { MeshMultiZoneService } from '../data'
import { YAML } from '@/app/application'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import { sources as servicesSources } from '@/app/services/sources'

const props = defineProps<{
  data: MeshMultiZoneService
}>()
</script>

<style lang="scss" scoped>
.ip span {
  font-size: $kui-font-size-30;
}

.name-link {
  display: inline-block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}
</style>
