<template>
  <RouteView
    v-slot="{ route }"
    name="service-config-view"
    data-testid="service-config-view"
  >
    <AppView>
      <template #title>
        <h2>
          <RouteTitle
            :title="t('services.routes.item.navigation.service-config-view')"
            :render="true"
          />
        </h2>
      </template>

      <KCard>
        <template #body>
          <DataSource
            v-slot="{ data: externalService, error: externalServiceError }: ExternalServiceSource"
            :src="`/meshes/${route.params.mesh}/external-services/for/${route.params.service}`"
          >
            <ErrorBlock
              v-if="externalServiceError"
              :error="externalServiceError"
            />

            <LoadingBlock v-else-if="externalService === undefined" />

            <EmptyBlock v-else-if="externalService === null">
              <template #title>
                <p>{{ t('services.detail.no_matching_external_service', { name: route.params.service }) }}</p>
              </template>
            </EmptyBlock>

            <ResourceCodeBlock
              v-else
              id="code-block-service"
              :resource="externalService"
              :resource-fetcher="(params) => kumaApi.getExternalService({ mesh: externalService.mesh, name: externalService.name }, params)"
              is-searchable
            />
          </DataSource>
        </template>
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { ExternalServiceSource } from '../sources'
import AppView from '@/app/application/components/app-view/AppView.vue'
import DataSource from '@/app/application/components/data-source/DataSource.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import ResourceCodeBlock from '@/app/common/ResourceCodeBlock.vue'
import { useI18n, useKumaApi } from '@/utilities'

const { t } = useI18n()
const kumaApi = useKumaApi()
</script>
