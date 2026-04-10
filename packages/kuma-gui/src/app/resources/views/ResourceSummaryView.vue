<template>
  <RouteView
    :name="props.routeName"
    :params="{
      kri: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      format: String,
    }"
    v-slot="{ route, t, uri }"
  >
    <DataCollection
      :items="props.items"
      :predicate="item => item.kri === route.params.kri"
    >
      <template #empty>
        <XEmptyState>
          <template #title>
            <h2>
              {{ t('common.collection.summary.empty_title', { type: 'Resource' }) }}
            </h2>
          </template>
          <p>
            {{ t('common.collection.summary.empty_message', { type: 'Resource' }) }}
          </p>
        </XEmptyState>
      </template>
      <template
        #default="{ items: resources }"
      >
        <template
          v-for="item in [resources[0]]"
          :key="item.kri"
        >
          <AppView>
            <template #title>
              <XLayout
                variant="y-stack"
                size="small"
              >
                <h2
                  v-icon-start="`policy`"
                >
                  <XAction
                    :to="{
                      name: 'resource-detail-view',
                      params: {
                        kri: item.kri,
                      },
                    }"
                  >
                    <RouteTitle
                      :title="t('resources.routes.item.title', { name: item.name })"
                    />
                  </XAction>
                </h2>
              </XLayout>
            </template>

            <XLayout variant="y-stack">
              <header>
                <XLayout
                  variant="separated"
                  size="max"
                >
                  <h3>
                    {{ t('resources.routes.item.config') }}
                  </h3>
                  <div
                    v-for="options in [['universal', 'k8s']]"
                    :key="typeof options"
                  >
                    <XSelect
                      :label="t('resources.routes.item.format')"
                      :selected="route.params.format"
                      @change="(value) => {
                        route.update({ format: value })
                      }"
                      @vue:before-mount="$event?.props?.selected && options.includes($event.props.selected) && $event.props.selected !== route.params.format && route.update({ format: $event.props.selected })"
                    >
                      <template
                        v-for="value in options"
                        :key="value"
                        #[`${value}-option`]
                      >
                        {{ t(`resources.routes.item.formats.${value}`) }}
                      </template>
                    </XSelect>
                  </div>
                </XLayout>
              </header>
            </XLayout>

            <template v-if="route.params.format !== 'k8s'">
              <XCodeBlock
                data-testid="codeblock-yaml-universal"
                language="yaml"
                :code="YAML.stringify(item.config)"
                is-searchable
                :query="route.params.codeSearch"
                :is-filter-mode="route.params.codeFilter"
                :is-reg-exp-mode="route.params.codeRegExp"
                @query-change="route.update({ codeSearch: $event })"
                @filter-mode-change="route.update({ codeFilter: $event })"
                @reg-exp-mode-change="route.update({ codeRegExp: $event })"
              />
            </template>

            <template v-else>
              <DataLoader
                :src="uri(sources, '/resource/:kri/as/kubernetes', {
                  kri: route.params.kri,
                })"
                v-slot="{ data: [k8sConfig] }"
              >
                <XCodeBlock
                  data-testid="codeblock-yaml-k8s"
                  language="yaml"
                  :code="YAML.stringify(k8sConfig)"
                  is-searchable
                  :query="route.params.codeSearch"
                  :is-filter-mode="route.params.codeFilter"
                  :is-reg-exp-mode="route.params.codeRegExp"
                  @query-change="route.update({ codeSearch: $event })"
                  @filter-mode-change="route.update({ codeFilter: $event })"
                  @reg-exp-mode-change="route.update({ codeRegExp: $event })"
                />
              </DataLoader>
            </template>
          </AppView>
        </template>
      </template>
    </DataCollection>
  </RouteView>
</template>

<script lang="ts" setup>
import type { Resource } from '../data/Resources'
import { sources } from '../sources'
import { YAML } from '@/app/application'

const props = defineProps<{
  items: Resource[]
  routeName: string
}>()
</script>
