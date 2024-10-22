<template>
  <RouteView
    name="diagnostics"
    :params="{
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
    v-slot="{ route, t, uri }"
  >
    <AppView
      :breadcrumbs="[
        {
          to: {
            name: 'diagnostics',
          },
          text: t('diagnostics.routes.item.breadcrumbs'),
        },
      ]"
    >
      <template #title>
        <h1>
          <RouteTitle
            :title="t('diagnostics.routes.item.title')"
          />
        </h1>
      </template>

      <KCard>
        <DataLoader
          :src="uri(sources, `/config`, {})"
          v-slot="{ data }"
        >
          <XCodeBlock
            data-testid="code-block-diagnostics"
            language="json"
            :code="JSON.stringify(data, null, 2)"
            is-searchable
            :query="route.params.codeSearch"
            :is-filter-mode="route.params.codeFilter"
            :is-reg-exp-mode="route.params.codeRegExp"
            @query-change="route.update({ codeSearch: $event })"
            @filter-mode-change="route.update({ codeFilter: $event })"
            @reg-exp-mode-change="route.update({ codeRegExp: $event })"
          />
        </DataLoader>
      </KCard>
    </AppView>
  </RouteView>
</template>
<script lang="ts" setup>
import { sources } from '@/app/control-planes/sources'
</script>
