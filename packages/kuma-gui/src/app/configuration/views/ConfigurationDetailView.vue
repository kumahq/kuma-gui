<template>
  <RouteView
    name="configuration-view"
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
            name: 'configuration-view',
          },
          text: t('configuration.routes.item.breadcrumbs'),
        },
      ]"
    >
      <template #title>
        <h1>
          <RouteTitle
            :title="t('configuration.routes.item.title')"
          />
        </h1>
      </template>

      <XCard>
        <DataLoader
          :src="uri(sources, `/config`, {})"
          :data="[{ foo: 'data' }, { bar: 'baz' }] as const"
          v-slot="{ data } /* The inferred type here should be like [NonNullable<TypeOf<T>>, ...K[]] */"
        >
          <XCodeBlock
            data-testid="code-block-configuration"
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
        <DataSource
          :src="uri(sources, `/foo`, {})"
          v-slot="{ data: foo }"
        >
          <DataLoader
            :src="uri(sources, `/global-insight`, {})"
            :data="[foo] as const"
            v-slot="{ data } /* The inferred type here should be like NonNullable<TypeOf<T>> */"
          >
            {{ JSON.stringify(data[0].createdAt) }}
            {{ JSON.stringify(data[1]?.foo) }}
            <XCodeBlock
              data-testid="code-block-configuration"
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
          <DataSource
            :src="uri(sources, '/bar', {})"
            v-slot="{ data: bar }"
          >
            <DataLoader
              :src="uri(sources, '/bar', {})"
              :data="[foo, bar, foo] as const"
              v-slot="{ data }"
            >
              {{ JSON.stringify(data[0].bar) }}
              {{ JSON.stringify(data[1].foo) }}
            </DataLoader>
            <DataLoader
              :data="[foo, bar] as const"
              v-slot="{ data }"
            >
              {{ JSON.stringify(data[0].foo) }}
            </DataLoader>
          </DataSource>
        </DataSource>
        <DataLoader
          :data="[{ foo: 'data' }, { bar: 'baz' }] as const"
          v-slot="{ data } /* The inferred type here should be like K[] */"
        >
          <XCodeBlock
            data-testid="code-block-configuration"
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
      </XCard>
    </AppView>
  </RouteView>
</template>
<script lang="ts" setup>
import { sources } from '@/app/control-planes/sources'
</script>
