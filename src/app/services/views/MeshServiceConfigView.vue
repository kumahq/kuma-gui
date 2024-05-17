<template>
  <RouteView
    v-slot="{ route, t }"
    name="mesh-service-config-view"
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
          {{ t('services.routes.item.navigation.mesh-service-config-view') }}
        </h2>
      </template>

      <KCard>
        <ResourceCodeBlock
          v-slot="{ copy, copying }"
          :resource="props.data.config"
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
            :src="`/meshes/${props.data.mesh}/mesh-service/${props.data.id}/as/kubernetes?no-store`"
            @change="(data) => {
              copy((resolve) => resolve(data))
            }"
            @error="(e) => {
              copy((_resolve, reject) => reject(e))
            }"
          />
        </ResourceCodeBlock>
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { MeshService } from '../data'
import ResourceCodeBlock from '@/app/common/code-block/ResourceCodeBlock.vue'
const props = defineProps<{
  data: MeshService
}>()
</script>
