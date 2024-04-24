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
      <div
        class="stack"
      >
        <DataSource
          v-slot="{ data }"
          :src="uri(sources, '/mesh-insights/:name', {
            name: route.params.mesh,
          })"
        >
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

        <div class="date-status-wrapper">
          <ResourceDateStatus
            :creation-time="mesh.creationTime"
            :modification-time="mesh.modificationTime"
          />
        </div>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { Mesh } from '../data'
import { sources } from '../sources'
import ResourceCodeBlock from '@/app/common/code-block/ResourceCodeBlock.vue'
import ResourceDateStatus from '@/app/common/ResourceDateStatus.vue'
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
}
</style>
