<template>
  <RouteView
    name="workload-detail-view"
    :params="{
      mesh: '',
      wl: '',
      page: 1,
      size: Number,
    }"
    v-slot="{ route, t, uri, me }"
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
                    :appearance="t(`common.status.appearance.${props.data.status}`, undefined, { defaultMessage: 'neutral' })"
                  >
                    {{ t(`http.api.value.${props.data.status}`) }}
                  </XBadge>
                </dd>
              </div>

              <div v-if="props.data.zone.length">
                <dt>{{ t('http.api.property.zone') }}</dt>
                <dd>
                  <XBadge>{{ props.data.zone }}</XBadge>
                </dd>
              </div>

              <div v-if="props.data.namespace.length">
                <dt>{{ t('http.api.property.namespace') }}</dt>
                <dd>
                  <XBadge>{{ props.data.namespace }}</XBadge>
                </dd>
              </div>

              <template
                v-for="labels in [Object.entries(props.data.labels).filter(([key]) => !['display-name', 'zone', 'namespace'].find((partial) => key.includes(partial)))]"
                :key="typeof labels"
              >
                <div>
                  <dt>{{ t('workloads.routes.item.about.labels') }}</dt>
                  <dd>
                    <XLayout
                      variant="x-stack"
                      truncate
                    >
                      <XBadge
                        v-for="[key, value] in labels"
                        :key="key"
                      >
                        {{ key }}: {{ value }}
                      </XBadge>
                    </XLayout>
                  </dd>
                </div>
              </template>
            </XDl>
          </template>
        </DataLoader>
      </XAboutCard>

      <XCard>
        <slot name="title">
          <h2>
            {{ t('workloads.routes.item.dataplaneProxies.title') }}
          </h2>
        </slot>
        <DataLoader
          :src="uri(dataplaneSources, `/meshes/:mesh/dataplanes/of/:type`, {
            mesh: route.params.mesh,
            type: 'standard',
          }, {
            page: route.params.page,
            size: route.params.size,
            search: `kuma.io/workload:${Kri.fromString(route.params.wl).name}`,
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
                { ...me.get('headers.status'), label: 'Status', key: 'status' },
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
                    name: 'data-plane-detail-view',
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

              <template #status="{ row }">
                <XBadge
                  :appearance="t(`common.status.appearance.${row.status}`, undefined, { defaultMessage: 'neutral' })"
                >
                  {{ t(`http.api.value.${row.status}`) }}
                </XBadge>
              </template>
            </AppCollection>
          </DataCollection>
        </DataLoader>
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
