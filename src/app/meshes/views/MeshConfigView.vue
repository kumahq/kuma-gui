<template>
  <RouteView
    v-slot="{ route }"
    name="mesh-config-view"
    data-testid="mesh-config-view"
  >
    <AppView>
      <template #title>
        <h2>
          <RouteTitle
            :title="t('meshes.routes.item.navigation.mesh-config-view')"
            :render="true"
          />
        </h2>
      </template>

      <KCard class="mt-4">
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
import { KCard } from '@kong/kongponents'

import { MeshSource } from '../sources'
import AppView from '@/app/application/components/app-view/AppView.vue'
import DataSource from '@/app/application/components/data-source/DataSource.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import ResourceCodeBlock from '@/app/common/ResourceCodeBlock.vue'
import { useI18n, useKumaApi } from '@/utilities'

const { t } = useI18n()
const kumaApi = useKumaApi()
</script>
