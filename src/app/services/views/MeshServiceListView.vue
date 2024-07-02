<template>
  <DataSource
    v-slot="{ data: me }: MeSource"
    src="/me"
  >
    <RouteView
      v-if="me"
      v-slot="{ route, t, can, uri }"
      name="mesh-service-list-view"
      :params="{
        page: 1,
        size: me.pageSize,
        mesh: '',
        service: '',
      }"
    >
      <RouteTitle
        :render="false"
        :title="t(`services.routes.mesh-service-list-view.title`)"
      />
      <AppView>
        <KCard>
          <DataLoader
            :src="uri(sources, '/meshes/:mesh/mesh-services', {
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
                    { label: 'Name', key: 'name' },
                    { label: 'Namespace', key: 'namespace' },
                    ...(can('use zones') ? [{ label: 'Zone', key: 'zone' }] : []),
                    { label: 'Addresses', key: 'addresses' },
                    { label: 'Ports', key: 'ports' },
                    { label: 'Tags', key: 'tags' },
                    { label: 'Actions', key: 'actions', hideLabel: true },
                  ]"
                  :page-number="route.params.page"
                  :page-size="route.params.size"
                  :total="data?.total"
                  :items="data?.items"
                  :is-selected-row="(item) => item.name === route.params.service"
                  @change="route.update"
                >
                  <template #name="{ row: item }">
                    <TextWithCopyButton
                      :text="item.name"
                    >
                      <XAction
                        data-action
                        :to="{
                          name: 'mesh-service-summary-view',
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
                    #ports="{ row: item }"
                  >
                    <KTruncate>
                      <KBadge
                        v-for="connection in item.spec.ports"
                        :key="connection.port"
                        appearance="info"
                      >
                        {{ connection.port }}:{{ connection.targetPort }}/{{ connection.appProtocol }}
                      </KBadge>
                    </KTruncate>
                  </template>
                  <template
                    #tags="{ row: item }"
                  >
                    <KTruncate>
                      <KBadge
                        v-for="(value, key) in item.spec.selector.dataplaneTags"
                        :key="`${key}:${value}`"
                        appearance="info"
                      >
                        {{ key }}:{{ value }}
                      </KBadge>
                    </KTruncate>
                  </template>
                  <template #actions="{ row: item }">
                    <XActionGroup>
                      <XAction
                        :to="{
                          name: 'mesh-service-detail-view',
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
                      name: 'mesh-service-list-view',
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
  </DataSource>
</template>

<script lang="ts" setup>
import { sources } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import type { MeSource } from '@/app/me/sources'
</script>
