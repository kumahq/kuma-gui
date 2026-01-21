<template>
  <RouteView
    name="hostname-generator-detail-view"
    :params="{
      name: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      environment: String,
    }"
    v-slot="{ route, t, uri }"
  >
    <RouteTitle
      :title="t('hostname-generators.routes.items.title')"
      :render="false"
    />

    <DataSource
      :src="uri(sources, '/hostname-generators/:name', {
        name: route.params.name,
      })"
      v-slot="{ data, error }"
    >
      <AppView :docs="t('hostname-generators.href.docs')">
        <template #title>
          <XProgress
            v-if="typeof data === 'undefined'"
            variant="line"
          />
          <h1 v-else>
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
            :created="data?.creationTime"
            :modified="data?.modificationTime"
          >
            <DataLoader
              :data="[data]"
              :errors="[error]"
            >
              <template v-if="typeof data !== 'undefined'">
                <template
                  v-for="labels in [{
                    ...data.spec.selector.meshService.matchLabels,
                    ...data.spec.selector.meshExternalService.matchLabels,
                    ...data.spec.selector.meshMultiZoneService.matchLabels,
                  }]"
                  :key="typeof labels"
                >
                  <XDl
                    v-if="Object.keys(labels).length"
                    variant="x-stack"
                  >
                    <div>
                      <dt>
                        {{ t('http.api.property.tags') }}
                      </dt>
                      <dd>
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
                      </dd>
                    </div>
                  </XDl>
                </template>
              </template>
            </DataLoader>
          </XAboutCard>

          <XCard>
            <DataLoader
              :data="[data]"
              :errors="[error]"
            >
              <XLayout v-if="typeof data !== 'undefined'">
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
                      :selected="route.params.environment"
                      @change="(value) => {
                        route.update({ environment: value })
                      }"
                      @vue:before-mount="$event?.props?.selected && options.includes($event.props.selected) && $event.props.selected !== route.params.environment && route.update({ environment: $event.props.selected })"
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

                <template v-if="route.params.environment === 'universal'">
                  <XCodeBlock
                    data-testid="codeblock-yaml-universal"
                    language="yaml"
                    :code="YAML.stringify(data.$raw)"
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
            </DataLoader>
          </XCard>
        </XLayout>
      </AppView>
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>
import { sources } from '../sources'
import { YAML } from '@/app/application'
</script>
