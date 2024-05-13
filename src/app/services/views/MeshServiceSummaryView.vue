<template>
  <RouteView
    v-slot="{ route, t }"
    name="mesh-service-summary-view"
    :params="{
      mesh: '',
      service: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
  >
    <DataCollection
      :items="props.items"
      :predicate="item => item.name === route.params.service"
    >
      <template
        #item="{ item }"
      >
        <AppView>
          <template #title>
            <h2>
              <RouteTitle
                :title="t('services.routes.item.title', { name: item.name })"
              />
            </h2>
          </template>

          <div
            class="stack"
          >
            <div>
              <h3>
                {{ t('services.routes.item.config') }}
              </h3>

              <div class="mt-4">
                <ResourceCodeBlock
                  v-slot="{ copy, copying }"
                  :resource="item.config"
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
                    :src="`/meshes/${route.params.mesh}/mesh-service/${route.params.service}/as/kubernetes?no-store`"
                    @change="(data) => {
                      copy((resolve) => resolve(data))
                    }"
                    @error="(e) => {
                      copy((_resolve, reject) => reject(e))
                    }"
                  />
                </ResourceCodeBlock>
              </div>
            </div>
          </div>
        </AppView>
      </template>
    </DataCollection>
  </RouteView>
</template>

<script lang="ts" setup>
import ResourceCodeBlock from '@/app/common/code-block/ResourceCodeBlock.vue'
import { MeshService } from '@/app/services/data'
const props = defineProps<{
  items: MeshService[]
}>()
</script>
