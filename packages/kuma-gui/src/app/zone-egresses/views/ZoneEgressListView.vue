<template>
  <RouteView
    name="zone-egress-list-view"
    :params="{
      page: 1,
      size: Number,
      zone: '',
      proxy: '',
      proxyType: '',
      s: '',
    }"
    v-slot="{ route, t, me, uri, can }"
  >
    <RouteTitle
      v-if="can('use zones')"
      :render="false"
      :title="t('zone-egresses.routes.items.title')"
    />
    <AppView
      :docs="t('zone-egresses.href.docs')"
    >
      <template
        v-if="!can('use zones')"
        #title
      >
        <h1>
          <RouteTitle
            :title="t('zone-egresses.routes.items.title')"
          />
        </h1>
      </template>
      <XI18n
        path="zone-egresses.routes.items.intro"
        default-path="common.i18n.ignore-error"
      />
      <XCard>
        <XLayout>
          <search>
            <form
              @submit.prevent
            >
              <XSearch
                class="search-field"
                :highlight="searchRegex"
                :keys="['name']"
                :value="route.params.s"
                @change="(s) => route.update({ page: 1, s })"
              />
            </form>
          </search>
        
          <DataLoader
            :src="uri(sources, `/zone-cps/:name/egresses`, {
              name: route.params.zone || '*',
            }, {
              page: route.params.page,
              size: route.params.size,
              search: route.params.s,
            })"
            variant="list"
            v-slot="{ data }"
          >
            <DataCollection
              type="zone-egresses"
              :items="data.items"
              :page="route.params.page"
              :page-size="route.params.size"
              :total="data.total"
              @change="route.update"
            >
              <AppCollection
                class="zone-egress-collection"
                data-testid="zone-egress-collection"
                :headers="[
                  { ...me.get('headers.name'), label: 'Name', key: 'name' },
                  { ...me.get('headers.socketAddress'), label: 'Address', key: 'socketAddress' },
                  { ...me.get('headers.status'), label: 'Status', key: 'status' },
                  { ...me.get('headers.actions'), label: 'Actions', key: 'actions', hideLabel: true },
                ]"
                :items="data.items"
                :is-selected-row="(row) => row.name === route.params.proxy"
                @resize="me.set"
              >
                <template #name="{ row: item }">
                  <XAction
                    data-action
                    :to="{
                      name: 'zone-egress-summary-view',
                      params: {
                        zone: route.params.zone,
                        proxy: item.id,
                      },
                      query: {
                        page: route.params.page,
                        size: route.params.size,
                        s: route.params.s,
                      },
                    }"
                  >
                    {{ item.name }}
                  </XAction>
                </template>

                <template #socketAddress="{ row: item }">
                  <XCopyButton
                    v-if="item.zoneEgress.socketAddress.length > 0"
                    :text="item.zoneEgress.socketAddress"
                  />
                  <template v-else>
                    {{ t('common.collection.none') }}
                  </template>
                </template>

                <template #status="{ row: item }">
                  <StatusBadge
                    :status="item.state"
                  />
                </template>

                <template #actions="{ row: item }">
                  <XActionGroup>
                    <XAction
                      :to="{
                        name: 'zone-egress-detail-view',
                        params: {
                          proxyType: 'egresses',
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
                    name: 'zone-egress-list-view',
                    params: {
                      zone: route.params.zone,
                      proxyType: route.params.proxyType,
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
                  />
                </SummaryView>
              </RouterView>
            </DataCollection>
          </DataLoader>
        </XLayout>
      </XCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { sources } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import { searchRegex } from '@/app/resources/data/Resource'
</script>
<style lang="scss" scoped>
.search-field {
  width: 100%;
}
</style>
