<template>
  <RouteView
    name="data-plane-clusters-view"
    :params="{
      mesh: '',
      dataPlane: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
    v-slot="{ route, t }"
  >
    <AppView>
      <RouteTitle
        :render="false"
        :title="t('data-planes.routes.item.navigation.data-plane-clusters-view')"
      />
      <KCard>
        <DataLoader
          :src="`/meshes/${route.params.mesh}/dataplanes/${route.params.dataPlane}/data-path/clusters`"
          v-slot="{ data, refresh }"
        >
          <CodeBlock
            language="json"
            :code="data"
            is-searchable
            :query="route.params.codeSearch"
            :is-filter-mode="route.params.codeFilter"
            :is-reg-exp-mode="route.params.codeRegExp"
            @query-change="route.update({ codeSearch: $event })"
            @filter-mode-change="route.update({ codeFilter: $event })"
            @reg-exp-mode-change="route.update({ codeRegExp: $event })"
          >
            <template #primary-actions>
              <XAction
                action="refresh"
                appearance="primary"
                @click="refresh"
              >
                Refresh
              </XAction>
            </template>
          </CodeBlock>
        </DataLoader>
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import CodeBlock from '@/app/common/code-block/CodeBlock.vue'
</script>
