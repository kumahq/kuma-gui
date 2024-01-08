<template>
  <RouteView
    v-slot="{ route, t }"
    name="data-plane-config-view"
    :params="{
      mesh: '',
      dataPlane: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
  >
    <AppView>
      <template #title>
        <h2>
          <RouteTitle
            :title="t('data-planes.routes.item.navigation.data-plane-config-view')"
          />
        </h2>
      </template>

      <KCard>
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
              :src="`/meshes/${route.params.mesh}/dataplanes/${route.params.dataPlane}/as/kubernetes?no-store`"
              @change="(data) => {
                copy((resolve) => resolve(data))
              }"
              @error="(e) => {
                copy((_resolve, reject) => reject(e))
              }"
            />
          </ResourceCodeBlock>
        </DataSource>
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { DataplaneSource } from '../sources'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import ResourceCodeBlock from '@/app/common/ResourceCodeBlock.vue'
</script>
