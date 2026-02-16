<template>
  <RouteView
    name="workload-detail-view"
    :params="{
      mesh: '',
      wl: '',
      page: 1,
      size: Number,
      proxy: '',
      s: '',
    }"
    v-slot="{ route, t, uri, me, can }"
  >
    <RouteTitle
      :render="false"
      :title="t('workloads.routes.item.title', { name: Kri.fromString(route.params.wl).name })"
    />
    <AppView>
      <XAboutCard
        :title="t('workloads.routes.item.about.title')"
        :created="typeof props.data !== 'undefined' && !(props.data instanceof Error) ? props.data.creationTime : undefined"
        :modified="typeof props.data !== 'undefined' && !(props.data instanceof Error) ? props.data.modificationTime : undefined"
        data-testid="about-workload"
      >
        <DataLoader
          :data="[props.data]"
        >
          <template v-if="typeof props.data !== 'undefined' && !(props.data instanceof Error)">
            <XDl>
              <div>
                <dt>{{ t('http.api.property.status') }}</dt>
                <dd>
                  <XBadge
                    :appearance="t(`common.status.appearance.${props.data.status.state}`, undefined, { defaultMessage: 'neutral' })"
                  >
                    {{ t(`http.api.value.${props.data.status.state}`) }}
                  </XBadge>
                </dd>
              </div>

              <div v-if="props.data.zone.length">
                <dt>{{ t('http.api.property.zone') }}</dt>
                <dd>
                  <XAction
                    v-if="props.data.zone"
                    :to="{
                      name: 'zone-cp-detail-view',
                      params: {
                        zone: props.data.zone,
                      },
                    }"
                  >
                    <XBadge>{{ props.data.zone }}</XBadge>
                  </XAction>
                </dd>
              </div>

              <div v-if="props.data.namespace.length">
                <dt>{{ t('http.api.property.namespace') }}</dt>
                <dd>
                  <XBadge>{{ props.data.namespace }}</XBadge>
                </dd>
              </div>

              <template
                v-for="labels in [Object.entries(props.data.labels)]"
                :key="typeof labels"
              >
                <div v-if="labels.length > 0">
                  <dt>{{ t('workloads.routes.item.about.labels') }}</dt>
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
          </template>
        </DataLoader>
      </XAboutCard>

      <XCard>
        <XLayout
          variant="y-stack"
        >
          <slot name="title">
            <h2>
              {{ t('workloads.routes.item.dataplaneProxies.title') }}
            </h2>
          </slot>
          <search>
            <form
              class="search-form"
              @submit.prevent
            >
              <XSearch
                class="search-field"
                :keys="['name', 'tag', 'label']"
                :value="route.params.s"
                @change="(s) => route.update({ page: 1, s })"
              />
            </form>
          </search>
          <template
            v-for="kri in [Kri.fromString(route.params.wl)]"
            :key="typeof kri"
          >
            <DataLoader
              :src="uri(dataplaneSources, `/meshes/:mesh/dataplanes/of/:type`, {
                mesh: route.params.mesh,
                type: 'standard',
              }, {
                page: route.params.page,
                size: route.params.size,
                search: `${route.params.s} kuma.io/workload:${kri.name} ${[['namespace', kri.namespace], ['zone', kri.zone]].filter(([ , v]) => v.length > 0).map(([k, v]) => `${k}:${v}`).join(' ')}`,
              })"
              variant="list"
              v-slot="{ data: dataPlanes }"
            >
              <DataCollection
                :items="dataPlanes.items"
                :total="dataPlanes.total"
                :page="route.params.page"
                :page-size="route.params.size"
                @change="route.update"
              >
                <AppCollection
                  class="data-plane-collection"
                  data-testid="data-plane-collection"
                  :headers="[
                    { ...me.get('headers.name'), label: 'Name', key: 'name' },
                    { ...me.get('headers.namespace'), label: 'Namespace', key: 'namespace' },
                    ...(can('use zones') ? [{ ...me.get('headers.zone'), label: 'Zone', key: 'zone' }] : []),
                    { ...me.get('headers.certificate'), label: 'Certificate info', key: 'certificate' },
                    { ...me.get('headers.status'), label: 'Status', key: 'status' },
                    { ...me.get('headers.warnings'), label: 'Warnings', key: 'warnings', hideLabel: true },
                    { ...me.get('headers.actions'), label: 'Actions', key: 'actions', hideLabel: true },
                  ]"
                  :items="dataPlanes.items"
                  @resize="me.set"
                >
                  <template #name="{ row: item }">
                    <XAction
                      data-action
                      class="name-link"
                      :title="item.name"
                      :to="{
                        name: 'workload-data-plane-summary-view',
                        params: {
                          mesh: item.mesh,
                          proxy: item.id,
                        },
                      }"
                    >
                      {{ item.name }}
                    </XAction>
                  </template>

                  <template #namespace="{ row: item }">
                    {{ item.namespace }}
                  </template>

                  <template #zone="{ row }">
                    <XAction
                      v-if="row.zone"
                      :to="{
                        name: 'zone-cp-detail-view',
                        params: {
                          zone: row.zone,
                        },
                      }"
                    >
                      {{ row.zone }}
                    </XAction>

                    <template v-else>
                      {{ t('common.collection.none') }}
                    </template>
                  </template>

                  <template #certificate="{ row }">
                    <template v-if="row.dataplaneInsight.mTLS?.certificateExpirationTime">
                      {{ t('common.formats.datetime', { value: Date.parse(row.dataplaneInsight.mTLS.certificateExpirationTime) }) }}
                    </template>

                    <template v-else>
                      {{ t('data-planes.components.data-plane-list.certificate.none') }}
                    </template>
                  </template>

                  <template #status="{ row }">
                    <XBadge
                      :appearance="t(`common.status.appearance.${row.status}`, undefined, { defaultMessage: 'neutral' })"
                    >
                      {{ t(`http.api.value.${row.status}`) }}
                    </XBadge>
                  </template>

                  <template #warnings="{ row: item }">
                    <template
                      v-for="warnings in [[
                        {
                          bool: item.dataplaneInsight.version?.kumaDp?.kumaCpCompatible === false || item.dataplaneInsight.version?.envoy?.kumaDpCompatible === false,
                          key: 'dp-cp-incompatible',
                        },
                        {
                          bool: item.isCertExpiresSoon,
                          key: 'certificate-expires-soon',
                        },
                        {
                          bool: item.isCertExpired,
                          key: 'certificate-expired',
                        },
                      ].filter(({ bool }) => bool)]"
                      :key="typeof warnings"
                    >
                      <XIcon
                        v-if="warnings.length > 0"
                        name="warning"
                        data-testid="warning"
                      >
                        <ul>
                          <li
                            v-for="{ key } in warnings"
                            :key="key"
                            :data-testid="`warning-${key}`"
                          >
                            {{ t(`data-planes.routes.items.warnings.${key}`) }}
                          </li>
                        </ul>
                      </XIcon>
                      <template v-else>
                        {{ t('common.collection.none') }}
                      </template>
                    </template>
                  </template>

                  <template #actions="{ row: item }">
                    <XActionGroup>
                      <XAction
                        :to="{
                          name: 'data-plane-detail-view',
                          params: {
                            proxy: item.id,
                          },
                        }"
                      >
                        {{ t('common.collection.actions.view') }}
                      </XAction>
                    </XActionGroup>
                  </template>
                </AppCollection>
                <RouterView
                  v-if="route.params.proxy"
                  v-slot="child"
                >
                  <XDrawer
                    @close="route.replace({
                      name: route.name,
                      params: {
                        mesh: route.params.mesh,
                      },
                      query: {
                        page: route.params.page,
                        size: route.params.size,
                      },
                    })"
                  >
                    <component
                      :is="child.Component"
                      v-if="typeof dataPlanes !== 'undefined'"
                      :items="dataPlanes.items"
                    />
                  </XDrawer>
                </RouterView>
              </DataCollection>
            </DataLoader>
          </template>
        </XLayout>
      </XCard>
    </AppView>
  </RouteView>
</template>
<script setup lang="ts">
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import { sources as dataplaneSources } from '@/app/data-planes/sources'
import { Kri } from '@/app/kuma'
import type { WorkloadItem } from '@/app/workloads/data'
const props = defineProps<{
  data: WorkloadItem | Error | undefined
}>()
</script>
<style scoped lang="scss">
.search-field {
  width: 100%;
}
</style>