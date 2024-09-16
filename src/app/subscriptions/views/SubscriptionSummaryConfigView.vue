<template>
  <RouteView
    name="subscription-summary-config-view"
    :params="{
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
    v-slot="{ route, t }"
  >
    <AppView>
      <template #title>
        <h2>
          {{ t('subscriptions.routes.item.headers.config') }}
        </h2>
      </template>

      <KCard>
        <CodeBlock
          language="yaml"
          :code="YAML.stringify(props.data)"
          is-searchable
          :query="route.params.codeSearch"
          :is-filter-mode="route.params.codeFilter"
          :is-reg-exp-mode="route.params.codeRegExp"
          @query-change="route.update({ codeSearch: $event })"
          @filter-mode-change="route.update({ codeFilter: $event })"
          @reg-exp-mode-change="route.update({ codeRegExp: $event })"
        />
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { YAML } from '@/app/application'
import CodeBlock from '@/app/common/code-block/CodeBlock.vue'
import type { KDSSubscription } from '@/app/zones/data'
const props = defineProps<{
  data: KDSSubscription
}>()
</script>
