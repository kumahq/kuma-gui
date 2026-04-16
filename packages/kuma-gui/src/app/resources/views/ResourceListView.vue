<template>
  <RouteView
    name="resource-list-view"
    :params="{
      page: 1,
      size: Number,
      mesh: '',
      resourcePath: '',
      kri: '',
      s: '',
    }"
    v-slot="{ route, t, can, uri, me }"
  >
    <DataCollection
      :predicate="(resourceType) => typeof resourceType !== 'undefined' && resourceType.path === route.params.resourcePath"
      :items="props.resourceTypes?.resources ?? []"
    >
      <template #empty>
        <XCard>
          <XEmptyState>
            {{ t('resources.routes.items.empty') }}
          </XEmptyState>
        </XCard>
      </template>
      <template #item="{ item: type }">
        <AppView>
          <XCard>
            <header>
              <div>
                <XBadge
                  v-if="'policy' in type && type.policy?.hasFromTargetRef"
                  appearance="neutral"
                >
                  {{ t('resources.routes.items.types.collection.inbound') }}
                </XBadge>

                <XBadge
                  v-if="'policy' in type && type.policy?.hasToTargetRef"
                  appearance="neutral"
                >
                  {{ t('resources.routes.items.types.collection.outbound') }}
                </XBadge>

                <XAction
                  action="docs"
                  :href="t(`resources.routes.items.types.${type.scope}.href.docs`, { name: type.name }, { defaultMessage: t('common.product.docs')})"
                  data-testid="policy-documentation-link"
                >
                  <span class="visually-hidden">{{ t('common.documentation') }}</span>
                </XAction>
              </div>
              <h3
                v-icon-start="{name: type.name, size: '60', default: 'policy'}"
              >
                {{ t('resources.routes.items.types.collection.title', { name: type.name }) }}
              </h3>
            </header>
            <XI18n
              :path="`resources.routes.items.types.${type.scope}.description`"
            />
          </XCard>
          <XCard>
            <search>
              <form
                @submit.prevent
              >
                <XSearch
                  class="search-field"
                  :keys="['name', 'namespace', ...(can('use zones') && type.policy?.isTargetRef ? ['zone'] : []), 'label']"
                  :value="route.params.s"
                  @change="(s) => route.update({ s })"
                />
              </form>
            </search>
            <DataLoader
              :src="type.scope === 'global' ? uri(sources, '/resources/:path', {
                path: route.params.resourcePath,
              }, {
                page: route.params.page,
                size: route.params.size,
                search: route.params.s,
              }) : uri(sources, '/resources/:path/for/:mesh', {
                path: route.params.resourcePath,
                mesh: route.params.mesh,
              }, {
                page: route.params.page,
                size: route.params.size,
                search: route.params.s,
              })"
              variant="list"
              v-slot="{ data: [data] }"
            >
              <DataCollection
                :items="data.items ?? []"
                :page="route.params.page"
                :page-size="route.params.size"
                :total="data.total"
                @change="route.update"
              >
                <template #empty>
                  <DataEmptyState
                    type="resources"
                  >
                    <template #title>
                      <h3>
                        {{ t('resources.x-empty-state.title') }}
                      </h3>
                    </template>
                    <XI18n
                      path="resources.x-empty-state.body"
                      :params="{
                        type: type.name,
                        suffix: route.params.s.length > 0 ? t('common.matchingsearch') : '',
                      }"
                    />
                    <template
                      #action
                    >
                      <XAction
                        action="docs"
                        :href="t(`resources.routes.items.types.${type.scope}.href.docs`, { name: type.name })"
                      >
                        {{ t('common.documentation') }}
                      </XAction>
                    </template>
                  </DataEmptyState>
                </template>
                <template
                  #default
                >
                  <AppCollection
                    :headers="[
                      { ...me.get('headers.name'), label: 'Name', key: 'name' },
                      ...(type.name !== 'Mesh' && type.name !== 'Zone' ? [{ ...me.get('headers.namespace'), label: 'Namespace', key: 'namespace' }] : []),
                      ...(can('use zones') && type.name !== 'Mesh' && type.name !== 'Zone' && (!type.policy || type.policy?.isTargetRef) ? [{ ...me.get('headers.zone'), label: 'Zone', key: 'zone' }] : []),
                      { ...me.get('headers.actions'), label: 'Actions', key: 'actions', hideLabel: true },
                    ]"
                    :items="data.items ?? []"
                    :is-selected-row="(row) => row.kri === route.params.kri"
                    @resize="me.set"
                  >
                    <template #name="{ row }">
                      <XAction
                        data-action
                        :to="{
                          name: 'resource-summary-view',
                          params: {
                            kri: row.kri,
                          },
                        }"
                      >
                        {{ row.name }}
                      </XAction>
                    </template>

                    <template #namespace="{ row }">
                      {{ row.namespace || '-' }}
                    </template>

                    <template #zone="{ row }">
                      <XAction
                        v-if="row.zone.length > 0"
                        :to="{
                          name: 'zone-cp-detail-view',
                          params: {
                            zone: row.zone,
                          },
                        }"
                      >
                        {{ row.zone }}
                      </XAction>
                    </template>

                    <template #actions="{ row }">
                      <XActionGroup>
                        <XAction
                          :to="{
                            name: 'resource-detail-view',
                            params: {
                              kri: row.kri,
                            },
                          }"
                        >
                          {{ t('common.collection.actions.view') }}
                        </XAction>
                      </XActionGroup>
                    </template>
                  </AppCollection>
                </template>
              </DataCollection>
              <RouterView
                v-if="route.params.kri"
                v-slot="{ Component }"
              >
                <XDrawer
                  @close="route.replace({
                    name: 'resource-list-view',
                    params: {
                      mesh: route.params.mesh,
                      policyPath: route.params.resourcePath,
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
                    :items="data.items"
                    :policy-type="type"
                  />
                </XDrawer>
              </RouterView>
            </DataLoader>
          </XCard>
        </AppView>
      </template>
    </DataCollection>
  </RouteView>
</template>

<script lang="ts" setup>
import type { ResourceTypeDescriptorCollection } from '../data'
import { sources } from '../sources'
import { useDataEmptyState } from '@/app/application'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
const DataEmptyState = useDataEmptyState()
const props = defineProps<{
  resourceTypes?: ResourceTypeDescriptorCollection
}>()
</script>
<style lang="scss" scoped>
header {
  display: flow-root;
}
header > * {
  margin-bottom: var(--x-space-40);
}
header > div {
  float: right;
  display: flex;
  gap: var(--x-space-40);
  align-items: flex-start;
}
header > h3 {
  margin-top: 0;
  float: left;
}
search form {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: stretch;
  flex-wrap: wrap;
  gap: var(--x-space-70);
  margin-bottom: var(--x-space-70);
}
.app-collection:deep(:is(th, td):nth-child(1)) {
  padding-right: 0 !important;
}
.search-field {
  flex: 1;
}
</style>
