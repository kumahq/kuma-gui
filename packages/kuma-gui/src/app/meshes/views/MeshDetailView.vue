<template>
  <RouteView
    name="mesh-detail-view"
    :params="{
      mesh: '',
      environment: String,
    }"
    v-slot="{ route, t, uri }"
  >
    <RouteTitle
      :title="t('meshes.routes.overview.title')"
      :render="false"
    />

    <DataSource
      :src="uri(sources, '/mesh-insights/:name', {
        name: route.params.mesh,
      })"
      v-slot="{ data }"
    >
      <DataSource
        :src="uri(resourceSources, '/meshes/:mesh/meshidentities', {
          mesh: route.params.mesh,
        })"
        v-slot="{ data: meshIdentities }"
      >
        <AppView
          :docs="t('meshes.href.docs')"
          :notifications="true"
        >
          <DataLoader
            :data="[meshIdentities]"
          >
            <XNotification
              :notify="!props.mesh.mtlsBackend"
              :uri="`meshes.notifications.mtls-warning:${props.mesh.id}`"
            >
              <XI18n
                path="meshes.notifications.mtls-warning"
              />
            </XNotification>
            <XNotification
              :notify="mesh.meshServices.mode === 'Disabled'"
              :uri="`meshes.notifications.mesh-service-activation:${route.params.mesh}`"
              variant="info"
            >
              <XI18n
                path="meshes.notifications.mesh-service-activation"
              />
            </XNotification>
            <XLayout
              type="stack"
            >
              <XAboutCard
                :title="t('meshes.routes.item.about.title')"
                :created="props.mesh.creationTime"
                :modified="props.mesh.modificationTime"
                class="about-section"
              >
                <XLayout>
                  <XLayout type="separated">
                    <template
                      v-for="policy in ['MeshTrafficPermission', 'MeshMetric', 'MeshAccessLog', 'MeshTrace']"
                      :key="policy"
                    >
                      <template
                        v-for="stats in [data?.policies?.[policy] ?? { total: 0 }]"
                        :key="typeof stats"
                      >
                        <XNotification
                          :notify="policy === 'MeshTrafficPermission' && props.mesh.mtlsBackend && stats.total === 0"
                          :uri="`meshes.notifications.mtp-warning:${props.mesh.id}`"
                        >
                          <XI18n
                            path="meshes.notifications.mtp-warning"
                          />
                        </XNotification>
                        <DefinitionCard
                          layout="horizontal"
                        >
                          <template #title>
                            <XAction
                              :to="{
                                name: 'policy-list-view',
                                params: {
                                  mesh: route.params.mesh,
                                  policyPath: `${policy.toLowerCase()}s`,
                                },
                              }"
                            >
                              {{ policy }}
                            </XAction>
                          </template>

                          <template #body>
                            <XBadge
                              :appearance="stats.total > 0 ? 'success' : 'neutral'"
                            >
                              {{ stats.total > 0 ? t('meshes.detail.enabled') : t('meshes.detail.disabled') }}
                            </XBadge>
                          </template>
                        </DefinitionCard>
                      </template>
                    </template>

                    <DefinitionCard layout="horizontal">
                      <template #title>
                        {{ t('http.api.property.mtls') }}
                      </template>

                      <template #body>
                        <XBadge
                          v-if="!props.mesh.mtlsBackend"
                          appearance="neutral"
                        >
                          {{ t('meshes.detail.disabled') }}
                        </XBadge>

                        <template v-else>
                          <XBadge appearance="info">
                            {{ props.mesh.mtlsBackend.type }} / {{ props.mesh.mtlsBackend.name }}
                          </XBadge>
                        </template>
                      </template>
                    </DefinitionCard>
                  </XLayout>

                  <XLayout
                    v-if="meshIdentities?.items?.length"
                    data-testid="meshidentities-collection"
                    class="about-subsection"
                  >
                    <h3>MeshIdentities</h3>
                    <XLayout size="small">
                      <XLayout type="separated">
                        <template
                          v-for="identity in meshIdentities.items"
                          :key="identity.name"
                        >
                          <XAction
                            :to="{
                              name: 'mesh-identity-summary-view',
                              params: {
                                name: identity.name.toLocaleLowerCase(),
                              },
                            }"
                          >
                            <XBadge appearance="info">
                              {{ identity.name }}
                            </XBadge>
                          </XAction>
                        </template>
                      </XLayout>
                    </XLayout>
                  </XLayout>
                </XLayout>
              </XAboutCard>

              <XCard>
                <XLayout
                  type="columns"
                  class="columns-with-borders"
                >
                  <ResourceStatus
                    :total="data?.services.total ?? 0"
                    data-testid="services-status"
                  >
                    <template #title>
                      {{ t('meshes.detail.services') }}
                    </template>
                  </ResourceStatus>

                  <ResourceStatus
                    :total="data?.dataplanesByType.standard.total ?? 0"
                    :online="data?.dataplanesByType.standard.online ?? 0"
                    data-testid="data-plane-proxies-status"
                  >
                    <template #title>
                      {{ t('meshes.detail.data_plane_proxies') }}
                    </template>
                  </ResourceStatus>

                  <DataSource
                    :src="uri(policySources, '/policy-types', {})"
                    v-slot="{ data: resources }"
                  >
                    <template
                      v-for="policyTypes in [resources?.policyTypes.map(item => item.name)]"
                      :key="typeof policyTypes"
                    >
                      <ResourceStatus
                        :total="Object.entries(data?.resources || {}).reduce((prev, [key, { total }]) => {
                          return (policyTypes || []).includes(key) ? prev + total : prev
                        }, 0)"
                        data-testid="policies-status"
                      >
                        <template #title>
                          {{ t('meshes.detail.policies') }}
                        </template>
                      </ResourceStatus>
                    </template>
                  </DataSource>
                </XLayout>
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
                        :label="t('meshes.routes.item.format')"
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
                          {{ t(`meshes.routes.item.formats.${value}`) }}
                        </template>
                      </XSelect>
                    </div>
                  </XLayout>

                  <template v-if="route.params.environment === 'universal'">
                    <XCodeBlock
                      data-testid="codeblock-yaml-universal"
                      language="yaml"
                      :code="YAML.stringify(props.mesh.config)"
                    />
                  </template>

                  <template v-else>
                    <DataLoader
                      :src="uri(sources, '/meshes/:name/as/kubernetes', {
                        name: route.params.mesh,
                      })"
                      v-slot="{ data: k8sConfig }"
                    >
                      <XCodeBlock
                        data-testid="codeblock-yaml-k8s"
                        language="yaml"
                        :code="YAML.stringify(k8sConfig)"
                      />
                    </DataLoader>
                  </template>
                </XLayout>
              </XCard>
            </XLayout>

            <RouterView
              v-slot="child"
            >
              <SummaryView
                v-if="child.route.name !== route.name"
                @close="route.replace({
                  name: 'mesh-detail-view',
                  params: {
                    mesh: route.params.mesh,
                  },
                  query: {
                    environment: route.params.environment,
                  },
                })"
              >
                <component
                  :is="child.Component"
                  :mesh-identities="meshIdentities?.items"
                />
              </SummaryView>
            </RouterView>
          </DataLoader>
        </AppView>
      </DataSource>
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>
import type { Mesh } from '../data'
import { sources } from '../sources'
import { YAML } from '@/app/application'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import ResourceStatus from '@/app/common/ResourceStatus.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import { sources as policySources } from '@/app/policies/sources'
import { sources as resourceSources } from '@/app/resources/sources'

const props = defineProps<{
  mesh: Mesh
}>()
</script>
<style lang="scss" scoped>
.about-subsection {
  border-top: $kui-border-width-10 solid $kui-color-border;
  padding-top: $kui-space-70;
}

:deep(.about-section .about-section-content) {
  display: block !important;

  h3 {
    color: $kui-color-text;
  }
}
</style>
