<template>
  <RouteView
    name="resource-detail-view"
    :params="{
      mesh: '',
      kri: '',
      resourcePath: '',
      format: String,
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
    v-slot="{ route, t, uri }"
  >
    <DataSource
      :src="uri(sources, '/resource/:kri', { kri: route.params.kri })"
      v-slot="{ data: sourceData }"
    >
      <AppView
        :breadcrumbs="[
          ...(route.params.mesh.length > 0 ? [
            {
              to: {
                name: 'mesh-detail-view',
                params: {
                  mesh: route.params.mesh,
                },
              },
              text: route.params.mesh,
            },
          ] : []),
          {
            to: {
              name: 'resource-list-view',
              params: {
                mesh: route.params.mesh,
                resourcePath: route.params.resourcePath,
              },
            },
            text: 'Resources',
          },
        ]"
      >
        <template #title>
          <DataLoader
            :data="[sourceData]"
            variant="header"
            v-slot="{ data: [data] }"
          >
            <h1>
              <XCopyButton
                :text="data.name"
              >
                <RouteTitle
                  :title="t('resources.routes.item.title', { name: data.name })"
                />
              </XCopyButton>
            </h1>
          </DataLoader>
        </template>
        <XCard
          data-testid="about-resource"
        >
          <template #title>
            <h2>
              {{ t('resources.routes.item.about.title', { resource: sourceData?.type ?? t('resources.routes.item.about.resource') }) }}
            </h2>
          </template>
          <DataLoader
            :data="[sourceData]"
            v-slot="{ data: [data] }"
          >
            <XTimespan
              :start="data.creationTime"
              :end="data.modificationTime"
            />
            <XDl>
              <div v-if="data.zone.length">
                <dt>{{ t('http.api.property.zone') }}</dt>
                <dd>
                  <XAction
                    v-if="data.zone"
                    :to="{
                      name: 'zone-cp-detail-view',
                      params: {
                        zone: data.zone,
                      },
                    }"
                  >
                    <XBadge>{{ data.zone }}</XBadge>
                  </XAction>
                </dd>
              </div>

              <div v-if="data.namespace.length">
                <dt>{{ t('http.api.property.namespace') }}</dt>
                <dd>
                  <XBadge>{{ data.namespace }}</XBadge>
                </dd>
              </div>

              <template
                v-for="labels in [Object.entries(data.labels)]"
                :key="typeof labels"
              >
                <div v-if="labels.length > 0">
                  <dt>{{ t('resources.routes.item.about.labels') }}</dt>
                  <dd>
                    <XLayout
                      variant="separated"
                      truncate
                    >
                      <template
                        v-for="kumaRe in [/^(.+\.)?kuma\.io\//]"
                        :key="typeof kumaRe"
                      >
                        <XBadge
                          v-for="[key, value] in labels"
                          :key="key"
                          :appearance="kumaRe.test(key) ? 'info' : 'decorative'"
                        >
                          {{ key }}:{{ value }}
                        </XBadge>
                      </template>
                    </XLayout>
                  </dd>
                </div>
              </template>
            </XDl>
          </DataLoader>
        </XCard>

        <XCard>
          <template #title>
            <header>
              <h2>
                Configuration
              </h2>
            </header>
          </template>
          <template #actions>
            <template
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
            </template>
          </template>
          <DataLoader
            :data="[sourceData]"
            v-slot="{ data: [data] }"
          >
            <template v-if="route.params.format !== 'k8s'">
              <XCodeBlock
                data-testid="codeblock-yaml-universal"
                language="yaml"
                :code="YAML.stringify(data.config)"
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
          </DataLoader>
        </XCard>
      </AppView>
    </DataSource>
  </RouteView>
</template>
<script setup lang="ts">
import { sources } from '../sources'
import { YAML } from '@/app/application'
</script>
