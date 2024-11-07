<template>
  <RouteView
    :name="$routeName!"
    :params="{
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
    v-slot="{ route }"
  >
    <AppView>
      <XCodeBlock
        language="yaml"
        :code="YAML.stringify(props.data.$raw)"
        is-searchable
        :query="route.params.codeSearch"
        :is-filter-mode="route.params.codeFilter"
        :is-reg-exp-mode="route.params.codeRegExp"
        @query-change="route.update({ codeSearch: $event })"
        @filter-mode-change="route.update({ codeFilter: $event })"
        @reg-exp-mode-change="route.update({ codeRegExp: $event })"
      />
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { Subscription } from '../data'
import { YAML } from '@/app/application'
const props = defineProps<{
  data: Subscription
}>()
</script>
