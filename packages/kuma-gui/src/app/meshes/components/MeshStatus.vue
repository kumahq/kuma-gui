<template>
  <DataSource
    :src="uri(resourceSources, '/resource-type-descriptors', {})"
    v-slot="{ result: sourceResourcesResult }"
  >
    <XI18n
      v-slot="{ t }"
    >
      <XCard
        data-testid="mesh-about-section"
      >
        <template
          #title
        >
          {{ t('meshes.routes.item.about.title') }}
        </template>
        <DataLoader
          :data="[sourceResourcesResult]"
          v-slot="{ data: [resourcesData] }"
        >
          <XTimespan
            :start="props.mesh.creationTime"
            :end="props.mesh.modificationTime"
          />
          <DataCollection
            :items="resourcesData.resources"
            :predicate="(resource) => ['MeshTrafficPermission', 'MeshMetric', 'MeshAccessLog', 'MeshTrace'].includes(resource.name)"
            v-slot="{ items: policyTypes }"
          >
            <XDl
              variant="x-stack"
            >
              <template
                v-for="policy in policyTypes"
                :key="policy.name"
              >
                <template
                  v-for="stats in [props.policies?.[policy.name] ?? { total: 0 }]"
                  :key="typeof stats"
                >
                  <XNotification
                    :notify="policy.name === 'MeshTrafficPermission' && props.mesh.mtlsBackend && stats.total === 0"
                    :uri="`meshes.notifications.mtp-warning:${props.mesh.id}`"
                  >
                    <XI18n
                      path="meshes.notifications.mtp-warning"
                    />
                  </XNotification>
                  <div>
                    <dt>
                      <XAction
                        :to="router.hasRoute('policy-list-view') ? {
                          name: 'policy-list-view',
                          params: {
                            mesh: props.mesh.name,
                            policyPath: policy.path,
                          },
                        } : {
                          name: 'mesh-resource-list-view',
                          params: {
                            mesh: props.mesh.name,
                            shortName: policy.shortName,
                          },
                        }"
                      >
                        {{ policy.name }}
                      </XAction>
                    </dt>
                    <dd>
                      <XBadge
                        :appearance="stats.total > 0 ? 'success' : 'neutral'"
                      >
                        {{ stats.total > 0 ? t('meshes.detail.enabled') : t('meshes.detail.disabled') }}
                      </XBadge>
                    </dd>
                  </div>
                </template>
              </template>
              <div
                data-testid="mesh-mtls"
              >
                <dt>
                  {{ t('http.api.property.mtls') }}
                </dt>
                <dd>
                  <XLayout
                    variant="separated"
                  >
                    <XBadge
                      v-if="props.mesh.mtlsBackend"
                      appearance="info"
                    >
                      {{ props.mesh.mtlsBackend.type }} / {{ props.mesh.mtlsBackend.name }}
                    </XBadge>
                    <template
                      v-for="identity in props.meshIdentities"
                      :key="identity.name"
                    >
                      <XAction
                        :to="{
                          name: 'mesh-mesh-identity-summary-view',
                          params: {
                            mid: identity.kri,
                          },
                        }"
                      >
                        <XBadge appearance="info">
                          MeshIdentity / {{ identity.name }}
                        </XBadge>
                      </XAction>
                    </template>
                    <XBadge
                      v-if="!props.mesh.mtlsBackend && !props.meshIdentities.length"
                      appearance="neutral"
                    >
                      {{ t('meshes.detail.disabled') }}
                    </XBadge>
                  </XLayout>
                </dd>
              </div>

              <div v-if="Object.keys(props.mesh.labels).length > 0">
                <dt>{{ t('services.routes.item.labels') }}</dt>
                <dd>
                  <XLayout
                    variant="separated"
                  >
                    <XAction
                      v-for="(value, key) in props.mesh.labels"
                      :key="key"
                      :href="t(`common.label.href.${key.replaceAll('.', '~')}`, {
                        mesh: '',
                        zone: '',
                        namespace: '',
                        name: value,
                      }, { defaultMessage: '' })"
                    >
                      <XBadge
                        :variant="r('kuma.label').test(key) ? 'reserved-kv' : 'kv'"
                      >
                        {{ key }}:<strong>{{ value }}</strong>
                      </XBadge>
                    </XAction>
                  </XLayout>
                </dd>
              </div>
            </XDl>
          </DataCollection>
        </DataLoader>
      </XCard>
    </XI18n>
  </DataSource>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router'

import type { Mesh } from '../data'
import { useRegExp, useUri } from '@/app/application'
import type { MeshIdentity } from '@/app/mesh-identities/data'
import { sources as resourceSources } from '@/app/resources/sources'
const props = defineProps<{
  mesh: Mesh
  meshIdentities: MeshIdentity[]
  policies?: Record<string, { total: number }>
}>()

const router = useRouter()
const { r } = useRegExp()
const uri = useUri()
</script>
