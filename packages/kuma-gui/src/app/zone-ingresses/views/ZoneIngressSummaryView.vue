<template>
  <RouteView
    name="zone-ingress-summary-view"
    :params="{
      proxy: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      format: String,
    }"
    v-slot="{ route, t, uri }"
  >
    <DataCollection
      :items="props.items"
      :predicate="item => item.id === route.params.proxy"
      :find="true"
    >
      <template
        #empty
      >
        <XEmptyState>
          <template
            #title
          >
            <h2>
              {{ t('common.collection.summary.empty_title', { type: 'ZoneIngress' }) }}
            </h2>
          </template>
          <p>
            {{ t('common.collection.summary.empty_message', { type: 'ZoneIngress' }) }}
          </p>
        </XEmptyState>
      </template>
      <template
        #default="{ items: proxies }"
      >
        <template
          v-for="item in [proxies[0]]"
          :key="item.id"
        >
          <AppView>
            <template
              #title
            >
              <h2>
                <XAction
                  :to="{
                    name: 'zone-ingress-detail-view',
                    params: {
                      zone: item.zoneIngress.zone,
                      proxyType: 'ingresses',
                      proxy: item.id,
                    },
                  }"
                >
                  <RouteTitle
                    :title="t('zone-ingresses.routes.item.title', { name: item.name })"
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
                    {{ t('zone-ingresses.routes.item.config') }}
                  </h3>
                  <div
                    v-for="options in [['structured', 'universal', 'k8s']]"
                    :key="typeof options"
                  >
                    <XSelect
                      :label="t('zone-ingresses.routes.items.format')"
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
                        {{ t(`zone-ingresses.routes.items.formats.${value}`) }}
                      </template>
                    </XSelect>
                  </div>
                </XLayout>
              </header>
              <template
                v-if="route.params.format === 'structured'"
              >
                <div
                  class="stack-with-borders"
                  data-testid="structured-view"
                >
                  <DefinitionCard
                    layout="horizontal"
                  >
                    <template
                      #title
                    >
                      {{ t('http.api.property.status') }}
                    </template>

                    <template
                      #body
                    >
                      <StatusBadge
                        :status="item.state"
                      />
                    </template>
                  </DefinitionCard>

                  <DefinitionCard
                    v-if="item.namespace.length > 0"
                    layout="horizontal"
                  >
                    <template
                      #title
                    >
                      {{ t('data-planes.routes.item.namespace') }}
                    </template>

                    <template
                      #body
                    >
                      {{ item.namespace }}
                    </template>
                  </DefinitionCard>

                  <DefinitionCard
                    layout="horizontal"
                  >
                    <template
                      #title
                    >
                      {{ t('http.api.property.address') }}
                    </template>

                    <template
                      #body
                    >
                      <template
                        v-if="item.zoneIngress.socketAddress.length > 0"
                      >
                        <XCopyButton
                          :text="item.zoneIngress.socketAddress"
                        />
                      </template>

                      <template
                        v-else
                      >
                        {{ t('common.detail.none') }}
                      </template>
                    </template>
                  </DefinitionCard>

                  <DefinitionCard
                    layout="horizontal"
                  >
                    <template
                      #title
                    >
                      {{ t('http.api.property.advertisedAddress') }}
                    </template>

                    <template
                      #body
                    >
                      <template
                        v-if="item.zoneIngress.advertisedSocketAddress.length > 0"
                      >
                        <XCopyButton
                          :text="item.zoneIngress.advertisedSocketAddress"
                        />
                      </template>

                      <template
                        v-else
                      >
                        {{ t('common.detail.none') }}
                      </template>
                    </template>
                  </DefinitionCard>
                </div>
              </template>

              <template
                v-else-if="route.params.format === 'universal'"
              >
                <ResourceCodeBlock
                  data-testid="codeblock-yaml-universal"
                  language="yaml"
                  :resource="item.config"
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

              <template
                v-else
              >
                <DataLoader
                  :src="uri(sources, '/zone-ingresses/:name/as/kubernetes', {
                    name: route.params.proxy,
                  })"
                  v-slot="{ data: k8sConfig }"
                >
                  <ResourceCodeBlock
                    data-testid="codeblock-yaml-k8s"
                    language="yaml"
                    :resource="k8sConfig"
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
      </template>
    </DataCollection>
  </RouteView>
</template>

<script lang="ts" setup>
import type { ZoneIngressOverview } from '../data'
import { sources } from '../sources'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import ResourceCodeBlock from '@/app/x/components/x-code-block/ResourceCodeBlock.vue'

const props = defineProps<{
  items: ZoneIngressOverview[]
}>()
</script>
<style scoped>
h2 {
  --icon-before: url('@/assets/images/zone.svg?inline') !important;
}
</style>
