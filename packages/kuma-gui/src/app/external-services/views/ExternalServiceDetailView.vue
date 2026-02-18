<template>
  <RouteView
    name="external-service-detail-view"
    :params="{
      mesh: '',
      service: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      environment: String,
    }"
    v-slot="{ route, t, uri }"
  >
    <AppView>
      <div
        class="stack"
      >
        <DataLoader
          :src="uri(sources, `/meshes/:mesh/external-services/:name`, {
            mesh: route.params.mesh,
            name: route.params.service,
          })"
          v-slot="{ data }"
        >
          <XAboutCard
            data-testid="external-service-details"
            :title="t('external-services.detail.about.title')"
            :created="data.creationTime"
            :modified="data.modificationTime"
          >
            <XDl variant="x-stack">
              <div>
                <dt>
                  {{ t('http.api.property.address') }}
                </dt>
                <dd>
                  <XCopyButton
                    variant="badge"
                    format="default"
                    :text="data.networking.address"
                  />
                </dd>
              </div>
              <div
                v-if="data.tags"
              >
                <dt>
                  {{ t('http.api.property.tags') }}
                </dt>
                <dd>
                  <TagList
                    :tags="data.tags"
                    should-truncate
                  />
                </dd>
              </div>
            </XDl>
          </XAboutCard>

          <XCard>
            <template #title>
              <h3>{{ t('external-services.detail.config') }}</h3>
            </template>

            <XLayout>
              <XLayout
                variant="separated"
                justify="end"
              >
                <div
                  v-for="options in [['universal', 'k8s']]"
                  :key="typeof options"
                >
                  <XSelect
                    :label="t('external-services.routes.item.format')"
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
                      {{ t(`external-services.routes.item.formats.${value}`) }}
                    </template>
                  </XSelect>
                </div>
              </XLayout>

              <template v-if="route.params.environment === 'universal'">
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
                  :src="uri(sources, `/meshes/:mesh/external-services/:name/as/kubernetes`, {
                    mesh: route.params.mesh,
                    name: route.params.service,
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
          </XCard>
        </DataLoader>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { sources } from '../sources'
import { YAML } from '@/app/application'
import TagList from '@/app/common/TagList.vue'
</script>
