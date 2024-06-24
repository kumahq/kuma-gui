<template>
  <RouteView
    v-slot="{ route, t, uri }"
    name="mesh-detail-view"
    :params="{
      mesh: '',
    }"
  >
    <RouteTitle
      :title="t('meshes.routes.overview.title')"
      :render="false"
    />

    <DataSource
      v-slot="{ data }"
      :src="uri(sources, '/mesh-insights/:name', {
        name: route.params.mesh,
      })"
    >
      <template
        v-for="missingTLSPolicy in [
          ['MeshTrafficPermission', 'TrafficPermission'].reduce((prev, item) => prev + (data?.policies?.[item]?.total ?? 0), 0) === 0,
        ]"
        :key="missingTLSPolicy"
      >
        <AppView>
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
          <div
            class="stack"
          >
            <AppAboutSection
              :title="t('meshes.routes.item.subtitle', {name: props.mesh.name})"
              :created="t('common.formats.datetime', {value: Date.parse(props.mesh.creationTime)})"
              :modified="t('common.formats.datetime', {value: Date.parse(props.mesh.modificationTime)})"
            >
              <div class="columns">
                <template
                  v-for="policy in ['MeshTrafficPermission', 'MeshMetric', 'MeshAccessLog', 'MeshTrace']"
                  :key="policy"
                >
                  <template
                    v-for="enabled in [Object.entries(data?.policies ?? {}).find(([key, value]) => key === policy)]"
                    :key="enabled"
                  >
                    <DefinitionCard>
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
                        <KBadge
                          appearance="neutral"
                        >
                          {{ enabled ? t('meshes.detail.enabled') : t('meshes.detail.disabled') }}
                        </KBadge>
                      </template>
                    </DefinitionCard>
                  </template>
                </template>
              </div>
            </AppAboutSection>

            <KCard>
              <div class="stack">
                <div class="columns">
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
                      <KBadge
                        v-if="!props.mesh.mtlsBackend"
                        appearance="neutral"
                      >
                        {{ t('meshes.detail.disabled') }}
                      </KBadge>

                      <template v-else>
                        {{ props.mesh.mtlsBackend.type }} / {{ props.mesh.mtlsBackend.name }}
                      </template>
                    </template>
                  </DefinitionCard>
                </div>
              </div>
            </KCard>
            <ResourceCodeBlock
              v-slot="{ copy, copying }"
              :resource="mesh.config"
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
          </div>
        </AppView>
      </template>
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>
import { AppAboutSection } from '@kong-ui-public/app-layout'

import type { Mesh } from '../data'
import { sources } from '../sources'
import ResourceCodeBlock from '@/app/common/code-block/ResourceCodeBlock.vue'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import ResourceStatus from '@/app/common/ResourceStatus.vue'

const props = defineProps<{
  mesh: Mesh
}>()
</script>

<style lang="scss" scoped>
:deep(.kong-ui-app-about-section .about-section-content) {
  display: block;
}
</style>
