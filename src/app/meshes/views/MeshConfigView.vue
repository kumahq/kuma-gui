<template>
  <RouteView
    v-slot="{ route, t }"
    name="mesh-config-view"
    data-testid="mesh-config-view"
    :params="{
      mesh: '',
    }"
  >
    <AppView>
      <template #title>
        <h2>
          <RouteTitle
            :title="t('meshes.routes.item.navigation.mesh-config-view')"
          />
        </h2>
      </template>

      <KCard>
        <template #body>
          <DataSource
            v-slot="{ data, error }: MeshSource"
            :src="`/meshes/${route.params.mesh}`"
          >
            <ErrorBlock
              v-if="error !== undefined"
              :error="error"
            />

            <LoadingBlock v-else-if="data === undefined" />

            <template v-else>
              <ResourceCodeBlock
                id="code-block-mesh"
                :resource="data"
                :resource-fetcher="(params) => kumaApi.getMesh({ name: route.params.mesh }, params)"
              />
            </template>
          </DataSource>
        </template>
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { MeshSource } from '../sources'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import ResourceCodeBlock from '@/app/common/ResourceCodeBlock.vue'
import { useKumaApi } from '@/utilities'

const kumaApi = useKumaApi()
</script>
