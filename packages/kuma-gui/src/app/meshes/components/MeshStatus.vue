<template>
  <XI18n
    v-slot="{ t }"
  >
    <XAboutCard
      :title="t('meshes.routes.item.about.title')"
      :created="props.mesh.creationTime"
      :modified="props.mesh.modificationTime"
      data-testid="mesh-about-section"
    >
      <XDl
        variant="x-stack"
      >
        <template
          v-for="policy in ['MeshTrafficPermission', 'MeshMetric', 'MeshAccessLog', 'MeshTrace']"
          :key="policy"
        >
          <template
            v-for="stats in [props.policies?.[policy] ?? { total: 0 }]"
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
            <div>
              <dt>
                <XAction
                  :to="{
                    name: 'policy-list-view',
                    params: {
                      mesh: props.mesh.name,
                      policyPath: `${policy.toLowerCase()}s`,
                    },
                  }"
                >
                  {{ policy }}
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

        <template
          v-for="labels in [Object.entries(props.mesh.labels)]"
          :key="typeof labels"
        >
          <div v-if="labels.length > 0">
            <dt>{{ t('services.routes.item.labels') }}</dt>
            <dd>
              <XLayout
                variant="separated"
                truncate
              >
                <template
                  v-for="kumaRe in [/^(.+\.)?kuma\.io\//]"
                  :key="typeof kumaRe"
                >
                  <XBadge
                    v-for="[key, value] in labels"
                    :key="key"
                    :appearance="kumaRe.test(key) ? 'info' : 'decorative'"
                  >
                    {{ key }}:{{ value }}
                  </XBadge>
                </template>
              </XLayout>
            </dd>
          </div>
        </template>
      </XDl>
    </XAboutCard>
  </XI18n>
</template>
<script lang="ts" setup>
import type { Mesh } from '../data'
import type { MeshIdentity } from '@/app/resources/data'
const props = defineProps<{
  mesh: Mesh
  meshIdentities: MeshIdentity[]
  policies?: Record<string, { total: number }>
}>()
</script>
