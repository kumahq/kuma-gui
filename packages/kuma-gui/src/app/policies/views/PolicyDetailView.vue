<template>
  <RouteView
    name="policy-detail-view"
    :params="{
      page: 1,
      size: Number,
      s: '',
      mesh: '',
      policy: '',
      policyPath: '',
      proxy: '',
    }"
    v-slot="{ route, t, uri, can, me }"
  >
    <AppView>
      <XAboutCard
        :title="t('policies.detail.about.title')"
        :created="props.data.creationTime"
        :modified="props.data.modificationTime"
      >
        <DefinitionCard layout="horizontal">
          <template
            #title
          >
            {{ t('http.api.property.type') }}
          </template>
          <template
            #body
          >
            <XBadge appearance="decorative">
              {{ props.data.type }}
            </XBadge>
          </template>
        </DefinitionCard>
        <DefinitionCard
          v-if="props.data.namespace.length > 0"
          layout="horizontal"
        >
          <template
            #title
          >
            {{ t('http.api.property.namespace') }}
          </template>
          <template
            #body
          >
            <XBadge appearance="decorative">
              {{ props.data.namespace }}
            </XBadge>
          </template>
        </DefinitionCard>
        <DefinitionCard
          v-if="can('use zones') && props.data.zone"
          layout="horizontal"
        >
          <template
            #title
          >
            {{ t('http.api.property.zone') }}
          </template>
          <template
            #body
          >
            <XBadge appearance="decorative">
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
            </XBadge>
          </template>
        </DefinitionCard>
        <DefinitionCard
          v-if="props.data.spec"
          layout="horizontal"
        >
          <template #title>
            {{ t('http.api.property.targetRef') }}
          </template>

          <template #body>
            <XBadge
              v-if="props.data.spec.targetRef"
              appearance="neutral"
            >
              {{ props.data.spec.targetRef.kind }}<span v-if="props.data.spec.targetRef.name">:<b>{{ props.data.spec.targetRef.name }}</b></span>
            </XBadge>
            <XBadge
              v-else
              appearance="neutral"
            >
              {{ t('http.api.property.mesh') }}
            </XBadge>
          </template>
        </DefinitionCard>
      </XAboutCard>
      
      <XCard
        class="mt-4"
      >
        <template #title>
          Affected Data Plane Proxies
        </template>
          
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
                :is-selected-row="(row) => row.id === route.params.proxy"
                @resize="me.set"
              >
                <template #name="{ row: item }">
                  <XAction
                    data-action
                    :to="{
                      name: 'data-plane-detail-view',
                      params: {
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
      </XCard>
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
