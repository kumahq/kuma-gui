<template>
  <RouteView
    name="mesh-detail-view"
    :params="{
      mesh: '',
      environment: String,
    }"
    v-slot="{ route, t, uri, me }"
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
        :src="uri(meshIdentitySources, '/meshes/:mesh/meshidentities', {
          mesh: route.params.mesh,
        })"
        v-slot="{ data: meshIdentities }"
      >
        <DataSource
          :src="uri(meshTrustSources, '/meshes/:mesh/meshtrusts', {
            mesh: route.params.mesh,
          })"
          v-slot="{ data: meshTrusts }"
        >
          <AppView
            :docs="t('meshes.href.docs')"
            :notifications="true"
          >
            <DataLoader
              :data="[meshIdentities, meshTrusts]"
              v-slot="{ data: [meshIdentitiesData, meshTrustsData] }"
            >
              <XNotification
                :notify="!props.mesh.mtlsBackend && meshIdentitiesData.items.length === 0"
                :uri="`meshes.notifications.mtls-warning:${props.mesh.id}`"
              >
                <XI18n path="meshes.notifications.mtls-warning" />
              </XNotification>
              <XNotification
                :notify="mesh.meshServices.mode === 'Disabled'"
                :uri="`meshes.notifications.mesh-service-activation:${props.mesh.id}`"
                variant="info"
              >
                <XI18n path="meshes.notifications.mesh-service-activation" />
              </XNotification>
              <XLayout variant="y-stack">
                <MeshStatus
                  :mesh="props.mesh"
                  :mesh-identities="meshIdentitiesData.items"
                  :policies="data?.policies"
                />
                <XCard v-if="meshTrustsData.items.length">
                  <template #title>
                    {{ t('meshes.routes.item.mesh-trusts.title') }}
                  </template>
                  <DataCollection
                    type="mesh-trusts"
                    :items="meshTrustsData.items"
                    v-slot="{ items }"
                  >
                    <AppCollection
                      data-testid="mesh-trusts-listing"
                      type="mesh-trusts-collection"
                      :items="items"
                      :headers="[
                        { ...me.get('headers.identity'), label: t('meshes.routes.item.mesh-trusts.name'), key: 'name' },
                        { ...me.get('headers.type'), label: t('meshes.routes.item.mesh-trusts.trust-domain'), key: 'trustDomain' },
                        { ...me.get('headers.origin'), label: t('meshes.routes.item.mesh-trusts.origin'), key: 'origin' },
                      ]"
                      @resize="me.set"
                    >
                      <template #name="{ row: item }">
                        <XAction
                          class="name-link"
                          :title="item.name"
                          :to="{
                            name: 'mesh-mesh-trust-summary-view',
                            params: {
                              mtrust: item.kri,
                            },
                            query: {
                              environment: route.params.environment,
                            },
                          }"
                          data-action
                        >
                          <b>{{ item.name }}</b>
                        </XAction>
                      </template>
                      <template #trustDomain="{ row: item }">
                        <XBadge appearance="decorative">
                          {{ item.spec.trustDomain }}
                        </XBadge>
                      </template>
                      <template #origin="{ row: item }">
                        <XAction
                          v-if="item.spec.origin.kri.length > 0"
                          :to="{
                            name: 'mesh-mesh-identity-summary-view',
                            params: {
                              mid: item.spec.origin.kri,
                            },
                          }"
                          data-action
                        >
                          <XBadge appearance="decorative">
                            {{ item.spec.origin.kri }}
                          </XBadge>
                        </XAction>
                      </template>
                    </AppCollection>
                  </DataCollection>
                </XCard>

                <XCard>
                  <XLayout
                    variant="columns"
                    class="columns-with-borders"
                  >
                    <ResourceStatus
                      v-if="props.mesh.meshServices.mode === 'Exclusive'"
                      :total="data?.resources.MeshServiceGeneric.total ?? 0"
                      data-testid="services-status"
                    >
                      <template #title>
                        {{ t('meshes.detail.services') }}
                      </template>
                    </ResourceStatus>
                    <ResourceStatus
                      v-else-if="props.mesh.meshServices.mode === 'Disabled'"
                      :total="data?.services.total ?? 0"
                      data-testid="services-status"
                    >
                      <template #title>
                        {{ t('meshes.detail.services') }}
                      </template>
                    </ResourceStatus>
                    <ResourceStatus
                      v-else
                      :total="data?.resources.MeshServiceGeneric.total ?? 0"
                      data-testid="mesh-services-status"
                    >
                      <template #title>
                        {{ t('meshes.detail.services') }}
                      </template>

                      <template
                        v-if="data?.resources.MeshServiceGeneric.total && data?.services.total > 0"
                        #description
                      >
                        {{ t('meshes.detail.mesh_services') }}
                      </template>

                      <template
                        v-if="data?.resources.MeshServiceGeneric.total && data?.services.total > 0"
                        #body
                      >
                        <ResourceStatus
                          :total="data?.services.total ?? 0"
                          data-testid="services-status"
                        >
                          <template #description>
                            {{ t('meshes.detail.services') }}

                            <XIcon name="info">
                              <XI18n path="meshes.detail.infos.services" />
                            </XIcon>
                          </template>
                        </ResourceStatus>
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
                  <XLayout variant="y-stack">
                    <XLayout
                      variant="action-group"
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
                        v-slot="{ data: [k8sConfig] }"
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

              <RouterView v-slot="child">
                <XDrawer
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
                    :mesh-identities="meshIdentitiesData.items"
                    :mesh-trusts="meshTrustsData.items"
                  />
                </XDrawer>
              </RouterView>
            </DataLoader>
          </AppView>
        </DataSource>
      </DataSource>
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>
import { useMeshStatus } from '../'
import type { Mesh } from '../data'
import { sources } from '../sources'
import { YAML } from '@/app/application'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import ResourceStatus from '@/app/common/ResourceStatus.vue'
import { sources as meshIdentitySources } from '@/app/mesh-identities/sources'
import { sources as meshTrustSources } from '@/app/mesh-trusts/sources'
import { sources as policySources } from '@/app/policies/sources'

const props = defineProps<{
  mesh: Mesh
}>()

const MeshStatus = useMeshStatus()
</script>
