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
            v-else-if="meshError ?? meshInsightError"
            :error="meshError ?? meshInsightError"
          />

          <EmptyBlock v-else-if="mesh === undefined || meshInsight === undefined" />

          <MeshDetails
            v-else
            :mesh="mesh"
            :mesh-insight="meshInsight"
            data-testid="detail-view-details"
          />
        </DataSource>
      </DataSource>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import MeshDetails from '../components/MeshDetails.vue'
import type { MeshSource, MeshInsightSource } from '../sources'
import AppView from '@/app/application/components/app-view/AppView.vue'
import DataSource from '@/app/application/components/data-source/DataSource.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import { useI18n } from '@/utilities'

const { t } = useI18n()
</script>
