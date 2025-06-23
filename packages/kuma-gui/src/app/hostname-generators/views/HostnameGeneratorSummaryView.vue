<template>
  <RouteView
    name="hostname-generator-summary-view"
    :params="{
      name: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      format: String,
    }"
    v-slot="{ route, t, can, uri }"
  >
    <DataCollection
      :items="props.items"
      :predicate="item => item.id === route.params.name"
    >
      <template
        #item="{ item }"
      >
        <AppView>
          <template #title>
            <h2>
              <XAction
                :to="{
                  name: 'hostname-generator-detail-view',
                  params: {
                    name: route.params.name,
                  },

                }"
              >
                <RouteTitle
                  :title="t('hostname-generators.routes.item.title', { name: item.name })"
                />
              </XAction>
            </h2>
          </template>

          <XLayout
            type="stack"
          >
            <header>
              <XLayout
                type="separated"
                size="max"
              >
                <h3>
                  {{ t('hostname-generators.routes.item.config') }}
                </h3>
                <div
                  v-for="options in [['structured', 'universal', 'k8s']]"
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
            </header>
            
            <template v-if="route.params.format === 'structured'">
              <div
                class="stack-with-borders"
                data-testid="structured-view"
              >
                <DefinitionCard
                  v-if="item.namespace.length > 0"
                  layout="horizontal"
                >
                  <template
                    #title
                  >
                    {{ t('hostname-generators.common.namespace') }}
                  </template>

                  <template
                    #body
                  >
                    {{ item.namespace }}
                  </template>
                </DefinitionCard>
                <DefinitionCard
                  v-if="can('use zones') && item.zone"
                  layout="horizontal"
                >
                  <template
                    #title
                  >
                    {{ t('hostname-generators.common.zone') }}
                  </template>
                  <template
                    #body
                  >
                    <XAction
                      :to="{
                        name: 'zone-cp-detail-view',
                        params: {
                          zone: item.zone,
                        },
                      }"
                    >
                      {{ item.zone }}
                    </XAction>
                  </template>
                </DefinitionCard>
                <DefinitionCard
                  v-if="item.spec.template"
                  layout="horizontal"
                >
                  <template
                    #title
                  >
                    {{ t('hostname-generators.common.template') }}
                  </template>
                  <template
                    #body
                  >
                    {{ item.spec.template }}
                  </template>
                </DefinitionCard>
              </div>
            </template>

            <template v-else-if="route.params.format === 'universal'">
              <XCodeBlock
                data-testid="codeblock-yaml-universal"
                language="yaml"
                :code="YAML.stringify(item.$raw)"
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
        </AppView>
      </template>
    </DataCollection>
  </RouteView>
</template>

<script lang="ts" setup>
import { sources } from '../sources'
import { YAML } from '@/app/application'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import type { HostnameGenerator } from '@/app/hostname-generators/data'
const props = defineProps<{
  items: HostnameGenerator[]
}>()
</script>
