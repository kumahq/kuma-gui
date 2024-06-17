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

    <AppView>
      <template
        v-if="!props.mesh.mtlsBackend"
        #notifications
      >
        <div v-html="t('meshes.routes.item.mtls-warning')" />
      </template>
      <div
        class="stack"
      >
        <DataSource
          v-slot="{ data }"
          :src="uri(sources, '/mesh-insights/:name', {
            name: route.params.mesh,
          })"
        >
          <KCard>
            <div class="date-status-wrapper">
              Created: {{ t('common.formats.datetime', {value: Date.parse(mesh.creationTime)}) }}
            </div>
            <div class="columns">
              <template
                v-for="policy in ['MeshMetric', 'MeshAccessLog', 'MeshTrace']"
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
          </KCard>
          <MeshStatus
            :mesh="props.mesh"
            :mesh-insight="data"
          />
        </DataSource>
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
  </RouteView>
</template>

<script lang="ts" setup>
import type { Mesh } from '../data'
import { sources } from '../sources'
import ResourceCodeBlock from '@/app/common/code-block/ResourceCodeBlock.vue'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import { useMeshStatus } from '@/app/meshes/'

const props = defineProps<{
  mesh: Mesh
}>()

const MeshStatus = useMeshStatus()

</script>

<style lang="scss" scoped>
.date-status-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1em
}
</style>
