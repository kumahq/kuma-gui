<template>
  <RouteView
    name="policy-detail-view"
    :params="{
      page: 1,
      size: 50,
      s: '',
      mesh: '',
      policy: '',
      policyPath: '',
      dataPlane: '',
    }"
    v-slot="{ route, t, uri, can, me }"
  >
    <AppView>
      <KCard
        v-if="can('use zones') && props.data.zone"
      >
        <div class="columns">
          <DefinitionCard>
            <template
              #title
            >
              Zone
            </template>
            <template
              #body
            >
              <XAction
                :to="{
                  name: 'zone-cp-detail-view',
                  params: {
                    zone: props.data.zone,
                  },
                }"
              >
                {{ props.data.zone }}
              </XAction>
            </template>
          </DefinitionCard>
        </div>
      </KCard>
      <div>
        <h3>
          Affected Data Plane Proxies
        </h3>
        <KCard
          class="mt-4"
        >
          <DataLoader
            :src="uri(sources, '/meshes/:mesh/policy-path/:path/policy/:name/dataplanes', {
              mesh: route.params.mesh,
              path: route.params.policyPath,
              name: route.params.policy,
            },{
              page: route.params.page,
              size: route.params.size,
            })"
          >
            <template
              #loadable="{ data: dataplanes }"
            >
              <DataCollection
                type="data-planes"
                :items="dataplanes?.items ?? [undefined]"
                :page="route.params.page"
                :page-size="route.params.size"
                :total="dataplanes?.total"
                @change="route.update"
              >
                <AppCollection
                  :headers="[
                    { ...me.get('headers.name'), label: 'Name', key: 'name' },
                    { ...me.get('headers.namespace'), label: 'Namespace', key: 'namespace' },
                    ...(can('use zones') ? [{ ...me.get('headers.zone'), label: 'Zone', key: 'zone' }] : []),
                    { ...me.get('headers.actions'), label: 'Actions', key: 'actions', hideLabel: true },
                  ]"
                  :items="dataplanes?.items"
                  :is-selected-row="(row) => row.id === route.params.dataPlane"
                  @resize="me.set"
                >
                  <template #name="{ row: item }">
                    <RouterLink
                      data-action
                      :to="{
                        name: 'data-plane-detail-view',
                        params: {
                          dataPlane: item.id,
                        },
                      }"
                    >
                      {{ item.name }}
                    </RouterLink>
                  </template>

                  <template #namespace="{ row: item }">
                    {{ item.namespace }}
                  </template>

                  <template #zone="{ row }">
                    <RouterLink
                      v-if="row.zone"
                      :to="{
                        name: 'zone-cp-detail-view',
                        params: {
                          zone: row.zone,
                        },
                      }"
                    >
                      {{ row.zone }}
                    </RouterLink>

                    <template v-else>
                      {{ t('common.collection.none') }}
                    </template>
                  </template>

                  <template #actions="{ row: item }">
                    <XActionGroup>
                      <XAction
                        :to="{
                          name: 'data-plane-detail-view',
                          params: {
                            dataPlane: item.id,
                          },
                        }"
                      >
                        {{ t('common.collection.actions.view') }}
                      </XAction>
                    </XActionGroup>
                  </template>
                </AppCollection>
                <RouterView
                  v-slot="{ Component }"
                >
                  <SummaryView
                    v-if="route.child()"
                    @close="route.replace({
                      params: {
                        mesh: route.params.mesh,
                      },
                      query: {
                        page: route.params.page,
                        size: route.params.size,
                        s: route.params.s,
                      },
                    })"
                  >
                    <component
                      :is="Component"
                      v-if="typeof dataplanes !== 'undefined'"
                      :items="dataplanes.items"
                    />
                  </SummaryView>
                </RouterView>
              </DataCollection>
            </template>
          </DataLoader>
        </KCard>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { Policy } from '../data'
import { sources } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import SummaryView from '@/app/common/SummaryView.vue'

const props = defineProps<{
  data: Policy
}>()
</script>
