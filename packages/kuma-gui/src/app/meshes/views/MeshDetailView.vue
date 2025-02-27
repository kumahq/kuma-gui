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
      <AppView
        :docs="t('meshes.href.docs')"
        :notifications="true"
      >
        <XNotification
          v-if="!props.mesh.mtlsBackend"
          :uri="`meshes.notifications.mtls-warning:${props.mesh.id}`"
        >
          <XI18n
            path="meshes.notifications.mtls-warning"
          />
        </XNotification>
        <XLayout
          type="stack"
        >
          <XAboutCard
            :title="t('meshes.routes.item.about.title')"
            :created="props.mesh.creationTime"
            :modified="props.mesh.modificationTime"
          >
            <template
              v-for="policy in ['MeshTrafficPermission', 'MeshMetric', 'MeshAccessLog', 'MeshTrace']"
              :key="policy"
            >
              <template
                v-for="stats in [data?.policies?.[policy] ?? { total: 0 }]"
                :key="typeof stats"
              >
                <XNotification
                  v-if="policy === 'MeshTrafficPermission' && props.mesh.mtlsBackend && stats.total === 0"
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
          </XAboutCard>

          <XCard>
            <XLayout
              type="stack"
            >
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

                <ResourceStatus
                  :total="data?.totalPolicyCount ?? 0"
                  data-testid="policies-status"
                >
                  <template #title>
                    {{ t('meshes.detail.policies') }}
                  </template>
                </ResourceStatus>
              </XLayout>
            </XLayout>
          </XCard>

          <XCard>
            <ResourceCodeBlock
              :resource="props.mesh.config"
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
          </XCard>
        </XLayout>
      </AppView>
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
