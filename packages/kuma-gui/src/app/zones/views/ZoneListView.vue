<template>
  <RouteView
    name="zone-cp-list-view"
    :params="{
      page: 1,
      size: Number,
      zone: '',
      s: '',
    }"
    v-slot="{ route, t, uri, me }"
  >
    <DataSource
      :src="uri(zoneSources, '/zone-cps', {}, {
        page: route.params.page,
        size: route.params.size,
        search: route.params.s,
      })"
      v-slot="{ data, error, refresh }"
    >
      <AppView
        :docs="data && data?.items?.length ? t('zones.href.docs.cta'): ''"
      >
        <template #title>
          <h1>
            <RouteTitle
              :title="t('zone-cps.routes.items.title')"
            />
          </h1>
        </template>
        
        <XI18n
          path="zone-cps.routes.items.intro"
          default-path="common.i18n.ignore-error"
        />
        <XTeleportTemplate
          v-if="(data?.items ?? []).length > 0"
          :to="{ name: 'zone-cp-list-view-actions'}"
        >
          <ZoneActionGroup />
        </XTeleportTemplate>
        <XCard>
          <XLayout variant="y-stack">
            <search>
              <form @submit.prevent>
                <XSearch
                  :keys="['name']"
                  :value="route.params.s"
                  @change="(s) => route.update({ page: 1, s })"
                />
              </form>
            </search>
            <DataLoader
              :data="[data]"
              :errors="[error]"
              variant="list"
              v-slot="{ data: [zones] }"
            >
              <DataCollection
                type="zone-cps"
                :items="zones.items"
                :page="route.params.page"
                :page-size="route.params.size"
                :total="zones.total"
                @change="route.update"
              >
                <AppCollection
                  class="zone-cp-collection"
                  data-testid="zone-cp-collection"
                  :headers="[
                    { ...me.get('headers.type'), label: '&nbsp;', key: 'type' },
                    { ...me.get('headers.name'), label: 'Name', key: 'name' },
                    { ...me.get('headers.zoneCpVersion'), label: 'Zone leader CP version', key: 'zoneCpVersion' },
                    { ...me.get('headers.state'), label: 'Status', key: 'state' },
                    { ...me.get('headers.warnings'), label: 'Warnings', key: 'warnings', hideLabel: true },
                    { ...me.get('headers.actions'), label: 'Actions', key: 'actions', hideLabel: true },
                  ]"
                  :items="zones.items"
                  :is-selected-row="(row) => row.kri === route.params.zone"
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
                          zone: item.kri,
                        },
                      }"
                    >
                      {{ item.name }}
                    </XAction>
                  </template>

                  <template #zoneCpVersion="{ row: item }">
                    {{ get(item.zoneInsight, 'version.kumaCp.version', t('common.collection.none')) }}
                  </template>

                  <template #state="{ row: item }">
                    <StatusBadge
                      :status="item.state"
                    />
                  </template>

                  <template
                    #warnings="{ row: item }"
                  >
                    <template
                      v-for="warnings in [[
                        {
                          bool: item.zoneInsight.store === 'memory',
                          key: 'store-memory',
                        },
                        {
                          bool: !item.zoneInsight.version?.kumaCp?.kumaCpGlobalCompatible,
                          key: 'global-cp-incompatible',
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
                            {{ t(`zone-cps.list.warnings.${key}`) }}
                          </li>
                        </ul>
                      </XIcon>
                      <template v-else>
                        {{ t('common.collection.none') }}
                      </template>
                    </template>
                  </template>

                  <template
                    #actions="{ row }"
                  >
                    <ZoneActionGroup
                      :item="row"
                      @change="refresh"
                    >
                      <XAction
                        :to="{
                          name: 'zone-cp-detail-view',
                          params: {
                            zone: row.kri,
                          },
                        }"
                      >
                        {{ t('common.collection.actions.view') }}
                      </XAction>
                    </ZoneActionGroup>
                  </template>
                </AppCollection>
              </DataCollection>
              <RouterView
                v-if="route.params.zone"
                v-slot="child"
              >
                <XDrawer
                  @close="route.replace({
                    name: 'zone-cp-list-view',
                    query: {
                      page: route.params.page,
                      size: route.params.size,
                      s: route.params.s,
                    },
                  })"
                >
                  <component
                    :is="child.Component"
                    :name="route.params.zone"
                    :zone-overview="zones.items.find((item) => item.name === route.params.zone)"
                  />
                </XDrawer>
              </RouterView>
            </DataLoader>
          </XLayout>
        </XCard>
      </AppView>
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>
import { useZoneActionGroup } from '../'
import { sources as zoneSources } from '../sources'
import { get } from '@/app/application'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
const ZoneActionGroup = useZoneActionGroup()
</script>

<style lang="scss" scoped>
.app-collection:deep(:is(th, td):nth-child(1)) {
  padding-left: 8px !important;
  padding-right: 0 !important;
  width: 16px !important;
}
.app-collection :deep(td:nth-child(2) a) {
  color: inherit;
  font-weight: var(--x-font-weight-semibold);
  text-decoration: none;
}
</style>
