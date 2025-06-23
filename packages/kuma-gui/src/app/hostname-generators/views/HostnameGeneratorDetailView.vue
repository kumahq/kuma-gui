<template>
  <RouteView
    name="hostname-generator-detail-view"
    :params="{
      name: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      format: String,
    }"
    v-slot="{ route, t, uri }"
  >
    <RouteTitle
      :title="t('hostname-generators.routes.items.title')"
      :render="false"
    />

    <DataLoader
      :src="uri(sources, '/hostname-generators/:name', {
        name: route.params.name,
      })"
      v-slot="{ data }"
    >
      <AppView :docs="t('hostname-generators.href.docs')">
        <template #title>
          <h1>
            <XCopyButton
              :text="data.name"
            >
              <RouteTitle
                :title="t('hostname-generators.routes.item.title', { name: data.name })"
              />
            </XCopyButton>
          </h1>
        </template>
        <XLayout
          type="stack"
        >
          <XAboutCard
            :title="t('hostname-generators.routes.item.about.title')"
            :created="data.creationTime"
            :modified="data.modificationTime"
          >
            <template
              v-for="labels in [{
                ...data.spec.selector.meshService.matchLabels,
                ...data.spec.selector.meshExternalService.matchLabels,
                ...data.spec.selector.meshMultiZoneService.matchLabels,
              }]"
              :key="typeof labels"
            >
              <DefinitionCard
                v-if="Object.keys(labels).length"
                layout="horizontal"
              >
                <template #title>
                  {{ t('http.api.property.tags') }}
                </template>

                <template #body>
                  <XLayout
                    type="separated"
                    truncate
                  >
                    <XBadge
                      v-for="([label, value], index) in Object.entries(labels)"
                      :key="`${label}${value}${index}`"
                    >
                      {{ label }}:{{ value }}
                    </XBadge>
                  </XLayout>
                </template>
              </DefinitionCard>
            </template>
          </XAboutCard>

          <XCard>
            <XLayout>
              <XLayout
                type="separated"
                justify="end"
              >
                <div
                  v-for="options in [['universal', 'k8s']]"
                  :key="typeof options"
                >
                  <XSelect
                    :label="t('hostname-generators.routes.item.format')"
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
                      {{ t(`hostname-generators.routes.item.formats.${value}`) }}
                    </template>
                  </XSelect>
                </div>
              </XLayout>

              <template v-if="route.params.format === 'universal'">
                <XCodeBlock
                  data-testid="codeblock-yaml-universal"
                  language="yaml"
                  :code="YAML.stringify(data.$raw)"
                  :show-k8s-copy-button="false"
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
                  :src="uri(sources, '/hostname-generators/:name/as/kubernetes', {
                    name: route.params.name,
                  })"
                  v-slot="{ data: k8sConfig }"
                >
                  <XCodeBlock
                    data-testid="codeblock-yaml-k8s"
                    language="yaml"
                    :code="YAML.stringify(k8sConfig)"
                    :show-k8s-copy-button="false"
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
            </XLayout>
          </XCard>
        </XLayout>
      </AppView>
    </DataLoader>
  </RouteView>
</template>

<script lang="ts" setup>
import { sources } from '../sources'
import { YAML } from '@/app/application'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
</script>
