<template>
  <RouteView
    v-slot="{ route, t }"
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
        data-testid="detail-view-details"
      >
        <DataSource
          v-slot="{ data: meshInsight }: MeshInsightSource"
          :src="`/mesh-insights/${route.params.mesh}`"
        >
          <MeshDetails
            :mesh="props.mesh"
            :mesh-insight="meshInsight"
          />
        </DataSource>
        <ResourceCodeBlock
          v-slot="{ copy, copying }"
          :resource="mesh.config"
        >
          <DataSource
            v-if="copying"
            :src="`/meshes/${route.params.mesh}/as/kubernetes?no-store`"
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
import type { MeshInsightSource } from '../sources'
import ResourceCodeBlock from '@/app/common/code-block/ResourceCodeBlock.vue'
import ResourceDateStatus from '@/app/common/ResourceDateStatus.vue'
import { useMeshDetails } from '@/components'

const MeshDetails = useMeshDetails()
const props = defineProps<{
  mesh: Mesh
}>()

</script>

<style lang="scss" scoped>
.date-status-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
