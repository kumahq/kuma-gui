<template>
  <RouteView
    v-slot="{ route, t, can, uri, me }"
    name="zone-cp-list-view"
    :params="{
      page: 1,
      size: 50,
      zone: '',
    }"
  >
    <AppView>
      <template #title>
        <h1>
          <RouteTitle
            :title="t('zone-cps.routes.items.title')"
          />
        </h1>
      </template>

      <DataSource
        v-slot="{ data, error, refresh }"
        :src="uri(zoneSources, '/zone-cps', {}, {
          page: route.params.page,
          size: route.params.size,
        })"
      >
        <DataSource
          :src="`/zone-ingress-overviews?page=1&size=100`"
          @change="getIngresses"
        />
        <DataSource
          :src="`/zone-egress-overviews?page=1&size=100`"
          @change="getEgresses"
        />
        <KCard>
          <ErrorBlock
            v-if="error !== undefined"
            :error="error"
          />
          <template
            v-else
          >
            <XTeleportTemplate
              v-if="can('create zones') && (data?.items ?? []).length > 0"
              :to="{ name: 'zone-cp-list-view-actions'}"
            >
              <XAction
                type="create"
                appearance="primary"
                :to="{ name: 'zone-create-view' }"
                data-testid="create-zone-link"
              >
                {{ t('zones.index.create') }}
              </XAction>
            </XTeleportTemplate>

            <AppCollection
              class="zone-cp-collection"
              data-testid="zone-cp-collection"
              :headers="[
                { ...me.get('headers.type'), label: '&nbsp;', key: 'type' },
                { ...me.get('headers.name'), label: 'Name', key: 'name' },
                { ...me.get('headers.zoneCpVersion'), label: 'Zone Leader CP Version', key: 'zoneCpVersion' },
                { ...me.get('headers.ingress'), label: 'Ingresses (online / total)', key: 'ingress' },
                { ...me.get('headers.egress'), label: 'Egresses (online / total)', key: 'egress' },
                { ...me.get('headers.state'), label: 'Status', key: 'state' },
                { ...me.get('headers.warnings'), label: 'Warnings', key: 'warnings', hideLabel: true },
                { ...me.get('headers.actions'), label: 'Actions', key: 'actions', hideLabel: true },
              ]"
              :page-number="route.params.page"
              :page-size="route.params.size"
              :total="data?.total"
              :items="data?.items"
              :error="error"
              :empty-state-title="can('create zones') ? t('zone-cps.empty_state.title') : undefined"
              :empty-state-message="can('create zones') ? t('zone-cps.empty_state.message') : undefined"
              :empty-state-cta-to="can('create zones') ? { name: 'zone-create-view' } : undefined"
              :empty-state-cta-text="can('create zones') ? t('zones.index.create') : undefined"
              :is-selected-row="(row) => row.name === route.params.zone"
              @change="route.update"
              @resize="me.set"
            >
              <template
                #type="{ row: item }"
              >
                <template
                  v-for="env in [(['kubernetes', 'universal'] as const).find(env => env === item.zoneInsight.environment) ?? 'kubernetes']"
                  :key="env"
                >
                  <XIcon
                    :name="env"
                  >
                    {{ t(`common.product.environment.${env}`) }}
                  </XIcon>
                </template>
              </template>
              <template #name="{ row: item }">
                <XAction
                  data-action
                  :to="{
                    name: 'zone-cp-detail-view',
                    params: {
                      zone: item.name,
                    },
                    query: {
                      page: route.params.page,
                      size: route.params.size,
                    },
                  }"
                >
                  {{ item.name }}
                </XAction>
              </template>

              <template #zoneCpVersion="{ row: item }">
                {{ get(item.zoneInsight, 'version.kumaCp.version', t('common.collection.none')) }}
              </template>

              <template #ingress="{ row: item }">
                <template
                  v-for="proxies in [ingresses[item.name] || {online: [], offline: []}]"
                >
                  {{ proxies.online.length }} / {{ proxies.online.length + proxies.offline.length }}
                </template>
              </template>

              <template #egress="{ row: item }">
                <template
                  v-for="proxies in [egresses[item.name] || {online: [], offline: []}]"
                >
                  {{ proxies.online.length }} / {{ proxies.online.length + proxies.offline.length }}
                </template>
              </template>

              <template #state="{ row: item }">
                <StatusBadge
                  :status="item.state"
                />
              </template>

              <template #warnings="{ row: item }">
                <XIcon
                  v-if="item.warnings.length > 0"
                  name="warning"
                  data-testid="warning"
                >
                  <ul>
                    <li
                      v-for="warning in item.warnings"
                      :key="warning.kind"
                      :data-testid="`warning-${warning.kind}`"
                    >
                      {{ t(`zone-cps.list.${warning.kind}`) }}
                    </li>
                  </ul>
                </XIcon>
                <template v-else>
                  {{ t('common.collection.none') }}
                </template>
              </template>

              <template
                #actions="{ row }"
              >
                <XActionGroup>
                  <XDisclosure
                    v-slot="{ expanded, toggle }"
                  >
                    <XAction
                      :to="{
                        name: 'zone-cp-detail-view',
                        params: {
                          zone: row.name,
                        },
                      }"
                    >
                      {{ t('common.collection.actions.view') }}
                    </XAction>
                    <XAction
                      v-if="can('create zones')"
                      appearance="danger"
                      @click="toggle"
                    >
                      {{ t('common.collection.actions.delete') }}
                    </XAction>
                    <XTeleportTemplate
                      :to="{ name: 'modal-layer' }"
                    >
                      <DeleteResourceModal
                        v-if="expanded"
                        :confirmation-text="row.name"
                        :delete-function="() => deleteZone(row.name)"
                        is-visible
                        :action-button-text="t('common.delete_modal.proceed_button')"
                        :title="t('common.delete_modal.title', { type: 'Zone' })"
                        data-testid="delete-zone-modal"
                        @cancel="toggle"
                        @delete="() => { toggle(); refresh() }"
                      >
                        <p>{{ t('common.delete_modal.text1', { type: 'Zone', name: row.name }) }}</p>

                        <p>{{ t('common.delete_modal.text2') }}</p>
                      </DeleteResourceModal>
                    </XTeleportTemplate>
                  </XDisclosure>
                </XActionGroup>
              </template>
            </AppCollection>
          </template>
        </KCard>
        <RouterView
          v-if="route.params.zone"
          v-slot="child"
        >
          <SummaryView
            @close="route.replace({
              name: 'zone-cp-list-view',
              query: {
                page: route.params.page,
                size: route.params.size,
              },
            })"
          >
            <component
              :is="child.Component"
              :name="route.params.zone"
              :zone-overview="data?.items.find((item) => item.name === route.params.zone)"
            />
          </SummaryView>
        </RouterView>
      </DataSource>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { sources as zoneSources } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import DeleteResourceModal from '@/app/common/DeleteResourceModal.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import { useKumaApi } from '@/app/kuma'
import type { ZoneEgressOverview } from '@/app/zone-egresses/data'
import type { ZoneIngressOverview } from '@/app/zone-ingresses/data'
import { get } from '@/utilities/get'

const kumaApi = useKumaApi()

type ZoneProxies<T> = Record<string, {online: T[], offline: T[]}>
const ingresses = ref<ZoneProxies<ZoneIngressOverview>>({})
const egresses = ref<ZoneProxies<ZoneEgressOverview>>({})

const getIngresses = (data: {items: ZoneIngressOverview[]}) => {
  const prop = 'zoneIngress'
  ingresses.value = data.items.reduce((prev, item) => {
    const name = item[prop]?.zone
    if (typeof name !== 'undefined') {
      if (typeof prev[name] === 'undefined') {
        prev[name] = {
          online: [],
          offline: [],
        }
      }
      const state = typeof item[`${prop}Insight`].connectedSubscription !== 'undefined' ? 'online' : 'offline'
      prev[name][state].push(item)
    }
    return prev
  }, {} as ZoneProxies<ZoneIngressOverview>)
}
const getEgresses = (data: {items: ZoneEgressOverview[]}) => {
  const prop = 'zoneEgress'
  egresses.value = data.items.reduce((prev, item) => {
    const name = item[prop]?.zone
    if (typeof name !== 'undefined') {
      if (typeof prev[name] === 'undefined') {
        prev[name] = {
          online: [],
          offline: [],
        }
      }
      const state = typeof item[`${prop}Insight`].connectedSubscription !== 'undefined' ? 'online' : 'offline'
      prev[name][state].push(item)
    }
    return prev
  }, {} as ZoneProxies<ZoneEgressOverview>)
}

async function deleteZone(name: string) {
  // Intentionally not wrapped in a try-catch block so that the DeleteResourceModal can discover when the operation failed.
  await kumaApi.deleteZone({ name })
}
</script>

<style lang="scss" scoped>
.app-collection:deep(:is(th, td):nth-child(1)) {
  padding-left: 8px !important;
  padding-right: 0 !important;
  width: 16px !important;
}
.app-collection :deep(td:nth-child(2) a) {
  color: inherit;
  font-weight: $kui-font-weight-semibold;
  text-decoration: none;
}
</style>
