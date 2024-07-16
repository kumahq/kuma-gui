<template>
  <RouteView
    name="zone-ingress-stats-view"
    :params="{
      zoneIngress: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
    v-slot="{ route, t }"
  >
    <RouteTitle
      :render="false"
      :title="t('zone-ingresses.routes.item.navigation.zone-ingress-stats-view')"
    />
    <AppView>
      <KCard>
        <DataLoader
          :src="`/zone-ingresses/${route.params.zoneIngress}/data-path/stats`"
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
                type="refresh"
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
