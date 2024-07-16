<template>
  <RouteView
    name="mesh-external-service-list-view"
    :params="{
      page: 1,
      size: 50,
      mesh: '',
      service: '',
    }"
    v-slot="{ route, t, can, uri, me }"
  >
    <RouteTitle
      :render="false"
      :title="t(`services.routes.mesh-external-service-list-view.title`)"
    />
    <AppView
      :docs="t('services.mesh-external-service.href.docs')"
    >
      <KCard>
        <DataLoader
          :src="uri(sources, '/meshes/:mesh/mesh-external-services', {
            mesh: route.params.mesh,
          },{
            page: route.params.page,
            size: route.params.size,
          })"
        >
          <template
            #loadable="{ data }"
          >
            <DataCollection
              type="services"
              :items="data?.items ?? [undefined]"
            >
              <AppCollection
                data-testid="service-collection"
                :headers="[
                  { ...me.get('headers.name'), label: 'Name', key: 'name' },
                  { ...me.get('headers.namespace'), label: 'Namespace', key: 'namespace' },
                  ...(can('use zones') ? [{ ...me.get('headers.zone'), label: 'Zone', key: 'zone' }] : []),
                  { ...me.get('headers.tls'), label: 'TLS', key: 'tls' },
                  { ...me.get('headers.addresses'), label: 'Addresses', key: 'addresses' },
                  { ...me.get('headers.port'), label: 'Port', key: 'port' },
                  { ...me.get('headers.actions'), label: 'Actions', key: 'actions', hideLabel: true },
                ]"
                :page-number="route.params.page"
                :page-size="route.params.size"
                :total="data?.total"
                :items="data?.items"
                :is-selected-row="(item) => item.name === route.params.service"
                @change="route.update"
                @resize="me.set"
              >
                <template #name="{ row: item }">
                  <TextWithCopyButton
                    :text="item.name"
                  >
                    <XAction
                      data-action
                      :to="{
                        name: 'mesh-external-service-summary-view',
                        params: {
                          mesh: item.mesh,
                          service: item.id,
                        },
                        query: {
                          page: route.params.page,
                          size: route.params.size,
                        },
                      }"
                    >
                      {{ item.name }}
                    </XAction>
                  </TextWithCopyButton>
                </template>
                <template
                  #namespace="{ row: item }"
                >
                  {{ item.namespace }}
                </template>
                <template #zone="{ row: item }">
                  <template v-if="item.labels && item.labels['kuma.io/origin'] === 'zone' && item.labels['kuma.io/zone']">
                    <XAction
                      v-if="item.labels['kuma.io/zone']"
                      :to="{
                        name: 'zone-cp-detail-view',
                        params: {
                          zone: item.labels['kuma.io/zone'],
                        },
                      }"
                    >
                      {{ item.labels['kuma.io/zone'] }}
                    </XAction>
                  </template>

                  <template v-else>
                    {{ t('common.detail.none') }}
                  </template>
                </template>
                <template #tls="{ row: item }">
                  <KBadge
                    appearance="neutral"
                  >
                    {{ item.spec.tls?.enabled ? 'Enabled' : 'Disabled' }}
                  </KBadge>
                </template>
                <template
                  #addresses="{ row: item }"
                >
                  <KTruncate>
                    <span
                      v-for="address in item.status.addresses"
                      :key="address.hostname"
                    >
                      {{ address.hostname }}
                    </span>
                  </KTruncate>
                </template>
                <template
                  #port="{ row: item }"
                >
                  <template
                    v-if="item.spec.match"
                  >
                    <KBadge
                      v-for="connection in [item.spec.match]"
                      :key="connection.port"
                      appearance="info"
                    >
                      {{ connection.port }}/{{ connection.protocol }}
                    </KBadge>
                  </template>
                </template>

                <template #actions="{ row: item }">
                  <XActionGroup>
                    <XAction
                      :to="{
                        name: 'mesh-external-service-detail-view',
                        params: {
                          mesh: item.mesh,
                          service: item.id,
                        },
                      }"
                    >
                      {{ t('common.collection.actions.view') }}
                    </XAction>
                  </XActionGroup>
                </template>
              </AppCollection>
              <RouterView
                v-if="data?.items && route.params.service"
                v-slot="child"
              >
                <SummaryView
                  @close="route.replace({
                    name: 'mesh-external-service-list-view',
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
                    :items="data?.items"
                  />
                </SummaryView>
              </RouterView>
            </DataCollection>
          </template>
        </DataLoader>
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { sources } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
</script>
