<template>
  <RouteView
    v-slot="{ route, t }"
    name="service-config-view"
    :params="{
      mesh: '',
      service: '',
      codeSearch: '',
    }"
  >
    <AppView>
      <template #title>
        <h2>
          <RouteTitle
            :title="t('services.routes.item.navigation.service-config-view')"
          />
        </h2>
      </template>

      <KCard>
        <template #body>
          <div>
            <DataSource
              v-slot="{ data: externalService, error: externalServiceError }: ExternalServiceSource"
              :src="`/meshes/${route.params.mesh}/external-services/for/${route.params.service}`"
            >
              <ErrorBlock
                v-if="externalServiceError"
                :error="externalServiceError"
              />

              <LoadingBlock v-else-if="externalService === undefined" />

              <EmptyBlock
                v-else-if="externalService === null"
                data-testid="no-matching-external-service"
              >
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
                :query="route.params.codeSearch"
                @query-change="route.update({ codeSearch: $event })"
              />
            </DataSource>
          </div>
        </template>
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { ExternalServiceSource } from '../sources'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import ResourceCodeBlock from '@/app/common/ResourceCodeBlock.vue'
import { useKumaApi } from '@/utilities'

const kumaApi = useKumaApi()
</script>
