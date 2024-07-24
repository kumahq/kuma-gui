<template>
  <RouteView
    name="zone-egress-xds-config-view"
    :params="{
      zoneEgress: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
    v-slot="{ route, t }"
  >
    <RouteTitle
      :render="false"
      :title="t('zone-egresses.routes.item.navigation.zone-egress-xds-config-view')"
    />
    <AppView>
      <KCard>
        <DataLoader
          :src="`/zone-egresses/${route.params.zoneEgress}/data-path/xds`"
          v-slot="{ data, refresh }"
        >
          <CodeBlock
            language="json"
            :code="JSON.stringify(data, null, 2)"
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
