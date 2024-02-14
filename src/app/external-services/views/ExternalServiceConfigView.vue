<template>
  <RouteView
    v-slot="{ route, t }"
    name="external-service-config-view"
    :params="{
      mesh: '',
      service: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
  >
    <AppView>
      <template #title>
        <h2>
          <RouteTitle
            :title="t('external-services.routes.item.navigation.external-service-config-view')"
          />
        </h2>
      </template>

      <DataSource
        v-slot="{ data, error }: ExternalServiceSource"
        :src="`/meshes/${route.params.mesh}/external-services/${route.params.service}`"
      >
        <ErrorBlock
          v-if="error"
          :error="error"
        />

        <LoadingBlock v-else-if="data === undefined" />

        <KCard
          v-else
          data-testid="external-service-config"
        >
          <div>
            <ResourceCodeBlock
              v-slot="{ copy, copying }"
              :resource="data.config"
              is-searchable
              :query="route.params.codeSearch"
              :is-filter-mode="route.params.codeFilter"
              :is-reg-exp-mode="route.params.codeRegExp"
              @query-change="route.update({ codeSearch: $event })"
              @filter-mode-change="route.update({ codeFilter: $event })"
              @reg-exp-mode-change="route.update({ codeRegExp: $event })"
            >
              <DataSource
                v-if="copying"
                :src="`/meshes/${data.mesh}/external-services/${data.name}/as/kubernetes?no-store`"
                @change="(data) => {
                  copy((resolve) => resolve(data))
                }"
                @error="(error) => {
                  copy((_resolve, reject) => reject(error))
                }"
              />
            </ResourceCodeBlock>
          </div>
        </KCard>
      </DataSource>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { ExternalServiceSource } from '../sources'
import ResourceCodeBlock from '@/app/common/code-block/ResourceCodeBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
</script>
