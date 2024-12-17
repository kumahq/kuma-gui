<template>
  <RouteView
    name="mesh-detail-view"
    :params="{
      mesh: '',
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
      <template
        v-for="missingTLSPolicy in [
          ['MeshTrafficPermission', 'TrafficPermission'].reduce((prev, item) => prev + (data?.policies?.[item]?.total ?? 0), 0) === 0,
        ]"
        :key="missingTLSPolicy"
      >
        <AppView
          :docs="t('meshes.href.docs')"
        >
          <template
            v-if="!props.mesh.mtlsBackend || missingTLSPolicy"
            #notifications
          >
            <ul>
              <li
                v-if="!props.mesh.mtlsBackend"
                v-html="t('meshes.routes.item.mtls-warning')"
              />
              <li
                v-if="props.mesh.mtlsBackend && missingTLSPolicy"
                v-html="t('meshes.routes.item.mtp-warning')"
              />
            </ul>
          </template>
          <XLayout
            type="stack"
          >
            <XAboutSection
              :title="t('meshes.routes.item.about.title')"
              :created="t('common.formats.datetime', { value: Date.parse(props.mesh.creationTime) })"
              :modified="t('common.formats.datetime', { value: Date.parse(props.mesh.modificationTime) })"
            >
              <template
                v-for="policy in ['MeshTrafficPermission', 'MeshMetric', 'MeshAccessLog', 'MeshTrace']"
                :key="policy"
              >
                <template
                  v-for="enabled in [Object.entries(data?.policies ?? {}).find(([key]) => key === policy)]"
                  :key="enabled"
                >
                  <DefinitionCard layout="horizontal">
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
                        :appearance="enabled ? 'success' : 'neutral'"
                      >
                        {{ enabled ? t('meshes.detail.enabled') : t('meshes.detail.disabled') }}
                      </XBadge>
                    </template>
                  </DefinitionCard>
                </template>
              </template>
            </XAboutSection>

            <XCard>
              <XLayout
                type="stack"
              >
                <XLayout
                  type="columns"
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

                  <ResourceStatus
                    :total="data?.totalPolicyCount ?? 0"
                    data-testid="policies-status"
                  >
                    <template #title>
                      {{ t('meshes.detail.policies') }}
                    </template>
                  </ResourceStatus>
                  <DefinitionCard>
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
                        {{ props.mesh.mtlsBackend.type }} / {{ props.mesh.mtlsBackend.name }}
                      </template>
                    </template>
                  </DefinitionCard>
                </XLayout>
              </XLayout>
            </XCard>
            <ResourceCodeBlock
              :resource="mesh.config"
              v-slot="{ copy, copying }"
            >
              <DataSource
                v-if="copying"
                :src="uri(sources, '/meshes/:name/as/kubernetes', {
                  name: route.params.mesh,
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
        </AppView>
      </template>
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>
import type { Mesh } from '../data'
import { sources } from '../sources'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import ResourceStatus from '@/app/common/ResourceStatus.vue'
import ResourceCodeBlock from '@/app/x/components/x-code-block/ResourceCodeBlock.vue'

const props = defineProps<{
  mesh: Mesh
}>()
</script>
