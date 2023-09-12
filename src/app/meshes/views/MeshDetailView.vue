<template>
  <RouteView
    v-slot="{ route }"
    name="mesh-overview-view"
  >
    <RouteTitle :title="t('meshes.routes.overview.title')" />

    <AppView>
      <DataSource
        v-slot="{ data: mesh, error: meshError }: MeshSource"
        :src="`/meshes/${route.params.mesh}`"
      >
        <DataSource
          v-slot="{ data: meshInsight }: MeshInsightSource"
          :src="`/mesh-insights/${route.params.mesh}`"
        >
          <ErrorBlock
            v-if="meshError"
            :error="meshError"
          />

          <LoadingBlock v-else-if="mesh === undefined" />

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
