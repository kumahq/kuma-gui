<template>
  <RouteView
    v-slot="{ route }"
    name="mesh-overview-view"
  >
    <RouteTitle :title="t('meshes.routes.overview.title')" />

    <AppView>
      <DataSource
        v-slot="{ data: mesh, isLoading: isLoadingMesh, error: meshError }: MeshSource"
        :src="`/meshes/${route.params.mesh}`"
      >
        <DataSource
          v-slot="{ data: meshInsight, isLoading: isLoadingMeshInsight, error: meshInsightError }: MeshInsightSource"
          :src="`/mesh-insights/${route.params.mesh}`"
        >
          <LoadingBlock v-if="isLoadingMesh || isLoadingMeshInsight" />

          <ErrorBlock
            v-else-if="meshError"
            :error="meshError"
          />

          <ErrorBlock
            v-else-if="meshInsightError"
            :error="meshInsightError"
          />

          <EmptyBlock v-else-if="mesh === undefined || meshInsight === undefined" />

          <div
            v-else
            class="stack"
            data-testid="detail-view-details"
          >
            <MeshDetails
              :mesh="mesh"
              :mesh-insight="meshInsight"
            />

            <div class="date-status-wrapper">
              <ResourceDateStatus
                :creation-time="mesh.creationTime"
                :modification-time="mesh.modificationTime"
              />
            </div>
          </div>
        </DataSource>
      </DataSource>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { MeshSource, MeshInsightSource } from '../sources'
import AppView from '@/app/application/components/app-view/AppView.vue'
import DataSource from '@/app/application/components/data-source/DataSource.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import ResourceDateStatus from '@/app/common/ResourceDateStatus.vue'
import { useMeshDetails } from '@/components'
import { useI18n } from '@/utilities'

const { t } = useI18n()
const MeshDetails = useMeshDetails()
</script>

<style lang="scss" scoped>
.date-status-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
