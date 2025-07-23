<template>
  <RouteView
    :name="props.routeName"
    :params="{
      mesh: '',
      gateway: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      format: String,
    }"
    v-slot="{ route, t, uri }"
  >
    <DataCollection
      :items="props.items"
      :predicate="item => item.id === route.params.gateway"
      :find="true"
    >
      <template #empty>
        <XEmptyState>
          <template #title>
            <h2>
              {{ t('common.collection.summary.empty_title', { type: 'Gateway' }) }}
            </h2>
          </template>
          <p>
            {{ t('common.collection.summary.empty_message', { type: 'Gateway' }) }}
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
            <template #title>
              <h2>
                <XAction
                  :to="{
                    name: 'builtin-gateway-detail-view',
                    params: {
                      mesh: item.mesh,
                      gateway: item.id,
                    },
                  }"
                >
                  <RouteTitle
                    :title="t('builtin-gateways.routes.item.title', { name: item.name })"
                  />
                </XAction>
              </h2>
            </template>
            <XLayout type="stack">
              <header>
                <XLayout
                  type="separated"
                  size="max"
                >
                  <h3>
                    {{ t('gateways.routes.item.config') }}
                  </h3>
                  <div
                    v-for="options in [['structured', 'universal', 'k8s']]"
                    :key="typeof options"
                  >
                    <XSelect
                      :label="t('gateways.routes.item.format')"
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
                        {{ t(`gateways.routes.item.formats.${value}`) }}
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
                    v-if="item.type.length > 0"
                    layout="horizontal"
                  >
                    <template #title>
                      {{ t('gateways.routes.item.type') }}
                    </template>

                    <template #body>
                      {{ item.type }}
                    </template>
                  </DefinitionCard>
                  <DefinitionCard
                    v-if="item.namespace.length > 0"
                    layout="horizontal"
                  >
                    <template #title>
                      {{ t('gateways.routes.item.namespace') }}
                    </template>

                    <template #body>
                      {{ item.namespace }}
                    </template>
                  </DefinitionCard>
                  <DefinitionCard
                    v-if="item.mesh.length > 0"
                    layout="horizontal"
                  >
                    <template #title>
                      {{ t('gateways.routes.item.mesh') }}
                    </template>

                    <template #body>
                      {{ item.mesh }}
                    </template>
                  </DefinitionCard>
                  <DefinitionCard
                    v-if="item.zone.length > 0"
                    layout="horizontal"
                  >
                    <template #title>
                      {{ t('gateways.routes.item.zone') }}
                    </template>

                    <template #body>
                      {{ item.zone }}
                    </template>
                  </DefinitionCard>
                  <DefinitionCard
                    v-if="item.creationTime.length > 0"
                    layout="horizontal"
                  >
                    <template #title>
                      {{ t('gateways.routes.item.created') }}
                    </template>

                    <template #body>
                      {{ t('common.formats.datetime', { value: Date.parse(item.creationTime) }) }}
                    </template>
                  </DefinitionCard>
                  <DefinitionCard
                    v-if="item.modificationTime.length > 0"
                    layout="horizontal"
                  >
                    <template #title>
                      {{ t('gateways.routes.item.modified') }}
                    </template>

                    <template #body>
                      {{ t('common.formats.datetime', { value: Date.parse(item.modificationTime) }) }}
                    </template>
                  </DefinitionCard>
                  <DefinitionCard
                    v-if="Object.keys(item.labels).length > 0"
                    layout="horizontal"
                  >
                    <template #title>
                      {{ t('gateways.routes.item.labels') }}
                    </template>
                    <template #body>
                      <XLayout
                        type="separated"
                        justify="end"
                      >
                        <template
                          v-for="([key, value]) in Object.entries(item.labels)"
                          :key="`${key}:${value}`"
                        >
                          <XBadge
                            appearance="info"
                            class="label"
                          >
                            <template v-if="key.includes('kuma.io/zone')">
                              <XAction
                                :to="{
                                  name: 'builtin-gateway-list-view',
                                  query: {
                                    s: `zone:${value}`,
                                  },
                                }"
                              >
                                {{ key }}:{{ value }}
                              </XAction>
                            </template>
                            <template v-else>
                              {{ key }}:{{ value }}
                            </template>
                          </XBadge>
                        </template>
                      </XLayout>
                    </template>
                  </DefinitionCard>
                  <DefinitionCard
                    v-if="item.selectors.length > 0"
                    layout="horizontal"
                  >
                    <template #title>
                      {{ t('gateways.routes.item.selectors') }}
                    </template>
                    <template #body>
                      <XLayout
                        type="separated"
                        justify="end"
                      >
                        <XBadge
                          v-for="([key, value]) in Object.entries(item.selectors[0].match)"
                          :key="`${key}:${value}`"
                          appearance="info"
                        >
                          {{ key }}:{{ value }}
                        </XBadge>
                      </XLayout>
                    </template>
                  </DefinitionCard>
                </div>

                <XCodeBlock
                  data-testid="codeblock-yaml-structured-conf"
                  language="yaml"
                  :code="YAML.stringify(item.conf)"
                  :show-k8s-copy-button="false"
                />
              </template>

              <template v-else-if="route.params.format === 'universal'">
                <XCodeBlock
                  data-testid="codeblock-yaml-universal"
                  language="yaml"
                  :code="YAML.stringify(item.config)"
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
                  :src="uri(sources, '/meshes/:mesh/mesh-gateways/:name/as/kubernetes', {
                    mesh: route.params.mesh,
                    name: route.params.gateway,
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
      </template>
    </DataCollection>
  </RouteView>
</template>

<script lang="ts" setup>
import type { MeshGateway } from '../data'
import { sources } from '../sources'
import { YAML } from '@/app/application'
import DataCollection from '@/app/application/components/data-collection/DataCollection.vue'
import DefinitionCard from '@/app/common/DefinitionCard.vue'

const props = defineProps<{
  items: MeshGateway[]
  routeName: string
}>()
</script>
<style scoped>
h2 {
  --icon-before: url('@/assets/images/gateway.svg?inline') !important;
}
.label :deep(a):hover {
  text-decoration: underline;
}
</style>
