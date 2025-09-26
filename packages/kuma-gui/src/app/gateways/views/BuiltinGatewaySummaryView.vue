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
              <h2
                v-icon-start="`dataplane-builtin`"
              >
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
                <XTable
                  data-testid="structured-view"
                  variant="kv"
                >
                  <tr
                    v-if="item.type.length > 0"
                  >
                    <th scope="row">
                      {{ t('gateways.routes.item.type') }}
                    </th>
                    <td>{{ item.type }}</td>
                  </tr>
                  <tr
                    v-if="item.namespace.length > 0"
                  >
                    <th scope="row">
                      {{ t('gateways.routes.item.namespace') }}
                    </th>
                    <td>{{ item.namespace }}</td>
                  </tr>
                  <tr
                    v-if="item.mesh.length > 0"
                  >
                    <th scope="row">
                      {{ t('gateways.routes.item.mesh') }}
                    </th>
                    <td>{{ item.mesh }}</td>
                  </tr>
                  <tr
                    v-if="item.zone.length > 0"
                  >
                    <th scope="row">
                      {{ t('gateways.routes.item.zone') }}
                    </th>
                    <td>{{ item.zone }}</td>
                  </tr>
                  <tr
                    v-if="item.creationTime.length > 0"
                  >
                    <th scope="row">
                      {{ t('gateways.routes.item.created') }}
                    </th>
                    <td>{{ t('common.formats.datetime', { value: Date.parse(item.creationTime) }) }}</td>
                  </tr>
                  <tr
                    v-if="item.modificationTime.length > 0"
                  >
                    <th scope="row">
                      {{ t('gateways.routes.item.modified') }}
                    </th>
                    <td>{{ t('common.formats.datetime', { value: Date.parse(item.modificationTime) }) }}</td>
                  </tr>
                  <tr
                    v-if="Object.keys(item.labels).length > 0"
                  >
                    <th scope="row">
                      {{ t('gateways.routes.item.labels') }}
                    </th>
                    <td>
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
                    </td>
                  </tr>
                  <tr
                    v-if="item.selectors.length > 0"
                  >
                    <th scope="row">
                      {{ t('gateways.routes.item.selectors') }}
                    </th>
                    <td>
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
                    </td>
                  </tr>
                </XTable>
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

const props = defineProps<{
  items: MeshGateway[]
  routeName: string
}>()
</script>
