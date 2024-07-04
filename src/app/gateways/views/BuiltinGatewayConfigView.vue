<template>
  <RouteView
    v-slot="{ route, t }"
    name="builtin-gateway-config-view"
    :params="{
      mesh: '',
      gateway: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
  >
    <RouteTitle
      :render="false"
      :title="t('builtin-gateways.routes.item.navigation.builtin-gateway-config-view')"
    />
    <AppView>
      <KCard>
        <DataSource
          v-slot="{ data, error }: MeshGatewaySource"
          :src="`/meshes/${route.params.mesh}/mesh-gateways/${route.params.gateway}`"
        >
          <ErrorBlock
            v-if="error"
            :error="error"
          />

          <LoadingBlock v-else-if="data === undefined" />

          <ResourceCodeBlock
            v-else
            v-slot="{ copy, copying }"
            data-testid="config"
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
              :src="`/meshes/${data.mesh}/mesh-gateways/${data.name}/as/kubernetes?no-store`"
              @change="(data) => {
                copy((resolve) => resolve(data))
              }"
              @error="(error) => {
                copy((_resolve, reject) => reject(error))
              }"
            />
          </ResourceCodeBlock>
        </DataSource>
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { MeshGatewaySource } from '../sources'
import ResourceCodeBlock from '@/app/common/code-block/ResourceCodeBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
</script>
