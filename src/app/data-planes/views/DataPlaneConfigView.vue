<template>
  <RouteView
    v-slot="{ route, t }"
    name="data-plane-config-view"
    :params="{
      mesh: '',
      dataPlane: '',
    }"
  >
    <AppView>
      <template #title>
        <h2>
          <RouteTitle
            :title="t('data-planes.routes.item.navigation.data-plane-config-view')"
            :render="true"
          />
        </h2>
      </template>

      <KCard>
        <template #body>
          <DataSource
            v-slot="{ data, error }: DataplaneSource"
            :src="`/meshes/${route.params.mesh}/dataplanes/${route.params.dataPlane}`"
          >
            <ErrorBlock
              v-if="error"
              :error="error"
            />

            <LoadingBlock v-else-if="data === undefined" />

            <ResourceCodeBlock
              v-else
              id="code-block-data-plane"
              :resource="data"
              :resource-fetcher="(params) => kumaApi.getDataplaneFromMesh({ mesh: data.mesh, name: data.name }, params)"
              is-searchable
            />
          </DataSource>
        </template>
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { DataplaneSource } from '../sources'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import ResourceCodeBlock from '@/app/common/ResourceCodeBlock.vue'
import { useKumaApi } from '@/utilities'

const kumaApi = useKumaApi()
</script>
