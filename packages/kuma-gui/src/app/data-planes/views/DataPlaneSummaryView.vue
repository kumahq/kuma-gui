<template>
  <RouteView
    :name="props.routeName"
    :params="{
      mesh: '',
      proxy: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      format: String,
    }"
    v-slot="{ route, t, uri, can }"
  >
    <DataCollection
      :items="props.items"
      :predicate="item => item.id === route.params.proxy"
    >
      <template #empty>
        <XEmptyState>
          <template #title>
            <h2>
              {{ t('common.collection.summary.empty_title', { type: 'Data Plane Proxy' }) }}
            </h2>
          </template>
          <p>
            {{ t('common.collection.summary.empty_message', { type: 'Data Plane Proxy' }) }}
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
              <XLayout size="small">
                <h2
                  :class="`type-${item.dataplaneType}`"
                >
                  <XAction
                    :to="{
                      name: 'data-plane-detail-view',
                      params: {
                        proxy: item.id,
                      },
                    }"
                  >
                    <RouteTitle
                      :title="t('data-planes.routes.item.title', { name: item.name })"
                    />
                  </XAction>
                </h2>
                <XBadge
                  :appearance="t(`common.status.appearance.${item.status}`, undefined, { defaultMessage: 'neutral' })"
                >
                  {{ t(`http.api.value.${item.status}`) }}
                </XBadge>
              </XLayout>
            </template>

            <XLayout>
              <header>
                <XLayout
                  type="separated"
                  size="max"
                >
                  <h3>
                    {{ t('data-planes.routes.item.config') }}
                  </h3>
                  <div
                    v-for="options in [['structured', 'universal', 'k8s']]"
                    :key="typeof options"
                  >
                    <XSelect
                      :label="t('data-planes.routes.item.format')"
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
                        {{ t(`data-planes.routes.item.formats.${value}`) }}
                      </template>
                    </XSelect>
                  </div>
                </XLayout>
              </header>
            </XLayout>

            <template v-if="route.params.format === 'structured'">
              <XLayout
                type="stack"
                size="large"
                data-testid="structured-view"
              >
                <XTable
                  variant="kv"
                >
                  <tr>
                    <th scope="row">
                      Type
                    </th>
                    <td>
                      {{ t(`data-planes.type.${item.dataplaneType}`) }}
                    </td>
                  </tr>
                  <tr
                    v-if="item.namespace.length > 0"
                  >
                    <th scope="row">
                      {{ t('data-planes.routes.item.namespace') }}
                    </th>
                    <td>
                      {{ item.namespace }}
                    </td>
                  </tr>
                  <tr
                    v-if="can('use zones') && item.zone"
                  >
                    <th scope="row">
                      Zone
                    </th>
                    <td>
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
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      {{ t('http.api.property.modificationTime') }}
                    </th>
                    <td>
                      {{ t('common.formats.datetime', { value: Date.parse(item.modificationTime) }) }}
                    </td>
                  </tr>
                </XTable>

                <XLayout
                  v-if="item.dataplane.networking.gateway"
                  type="stack"
                >
                  <h3>{{ t('data-planes.routes.item.gateway') }}</h3>

                  <XTable
                    variant="kv"
                  >
                    <tr>
                      <th scope="row">
                        {{ t('http.api.property.tags') }}
                      </th>
                      <td>
                        <TagList
                          alignment="right"
                          :tags="item.dataplane.networking.gateway.tags"
                        />
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">
                        {{ t('http.api.property.address') }}
                      </th>
                      <td>
                        <XCopyButton
                          :text="`${item.dataplane.networking.address}`"
                        />
                      </td>
                    </tr>
                  </XTable>
                </XLayout>

                <DataCollection
                  v-if="item.dataplaneType === 'standard'"
                  :items="item.dataplane.networking.inbounds"
                  v-slot="{ items : inbounds }"
                >
                  <XLayout
                    data-testid="dataplane-inbounds"
                  >
                    <h3>{{ t('data-planes.routes.item.inbounds') }}</h3>

                    <XLayout
                      v-for="(inbound, index) in inbounds"
                      :key="index"
                      class="inbound"
                    >
                      <h4 v-if="inbound.tags['kuma.io/service']">
                        <XCopyButton
                          :text="inbound.tags['kuma.io/service']"
                        >
                          {{ t('data-planes.routes.item.inbound_name', { service: inbound.tags['kuma.io/service'] }) }}
                        </XCopyButton>
                      </h4>

                      <XTable
                        variant="kv"
                      >
                        <tr>
                          <th scope="row">
                            {{ t('http.api.property.state') }}
                          </th>
                          <td>
                            <XBadge
                              v-if="inbound.state === 'Ready'"
                              appearance="success"
                            >
                              {{ t(`http.api.value.${inbound.state}`) }}
                            </XBadge>

                            <XBadge
                              v-else
                              appearance="danger"
                            >
                              {{ t(`http.api.value.${inbound.state}`) }}
                            </XBadge>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">
                            {{ t('http.api.property.tags') }}
                          </th>
                          <td>
                            <TagList
                              alignment="right"
                              :tags="inbound.tags"
                            />
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">
                            {{ t('http.api.property.address') }}
                          </th>
                          <td>
                            <XCopyButton :text="inbound.addressPort" />
                          </td>
                        </tr>
                      </XTable>
                    </XLayout>
                  </XLayout>
                </DataCollection>

                <DataCollection
                  v-if="item.dataplaneType === 'standard'"
                  :items="item.dataplane.networking.outbounds"
                  v-slot="{ items: outbounds }"
                >
                  <XLayout
                    data-testid="dataplane-outbounds"
                  >
                    <h3>{{ t('data-planes.routes.item.outbounds') }}</h3>
                    <XLayout
                      v-for="(outbound, index) in outbounds"
                      :key="index"
                      class="inbound"
                      size="small"
                    >
                      <h4 v-if="outbound.tags['kuma.io/service']">
                        <XCopyButton
                          :text="outbound.tags['kuma.io/service']"
                        >
                          {{ t('data-planes.routes.item.inbound_name', { service: outbound.tags['kuma.io/service'] }) }}
                        </XCopyButton>
                      </h4>

                      <XTable
                        variant="kv"
                      >
                        <tr
                          v-if="Object.keys(outbound.tags).length"
                        >
                          <th scope="row">
                            {{ t('http.api.property.tags') }}
                          </th>
                          <td>
                            <TagList
                              alignment="right"
                              :tags="outbound.tags"
                            />
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">
                            {{ t('http.api.property.address') }}
                          </th>
                          <td>
                            <XCopyButton :text="outbound.addressPort" />
                          </td>
                        </tr>
                      </XTable>
                    </XLayout>
                  </XLayout>
                </DataCollection>
              </XLayout>
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
                :src="uri(sources, '/meshes/:mesh/dataplanes/:name/as/kubernetes', {
                  mesh: route.params.mesh,
                  name: route.params.proxy,
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
          </AppView>
        </template>
      </template>
    </DataCollection>
  </RouteView>
</template>

<script lang="ts" setup>
import { DataplaneOverview } from '../data'
import { sources } from '../sources'
import { YAML } from '@/app/application'
import TagList from '@/app/common/TagList.vue'

const props = defineProps<{
  items: DataplaneOverview[]
  routeName: string
}>()
</script>
<style lang="scss" scoped>
h2 {
  --icon-before: url('@/assets/images/east-west.svg?inline') !important;

  &.type-delegated,
  &.type-builtin {
    --icon-before: url('@/assets/images/gateway.svg?inline') !important;
  }
}
</style>
