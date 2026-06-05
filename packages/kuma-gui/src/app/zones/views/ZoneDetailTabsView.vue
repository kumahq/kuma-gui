<template>
  <RouteView
    name="zone-cp-detail-tabs-view"
    :params="{
      zone: '',
    }"
    v-slot="{ route, t, uri }"
  >
    <DataSource
      :src="uri(sources, `/zone-cps/:name`, {
        name: route.params.zone,
      })"
      v-slot="{ data, error, result }"
    >
      <AppView
        :breadcrumbs="[
          {
            to: {
              name: 'zone-cp-list-view',
            },
            text: t('zone-cps.routes.item.breadcrumbs'),
          },
        ]"
      >
        <template #title>
          <DataLoader
            :data="[data]"
            variant="header"
            v-slot="{ data: [zone] }"
          >
            <h1>
              <RouteTitle
                :title="zone.name"
              />
            </h1>
          </DataLoader>
        </template>

        <template
          #actions
        >
          <ZoneActionGroup
            :item="data"
            @change="() => route.replace({ name: 'zone-cp-list-view' })"
          >
            <template
              #control
            >
              <XAction
                action="expand"
                appearance="primary"
              >
                {{ t('zones.action_menu.toggle_button') }}
              </XAction>
            </template>
          </ZoneActionGroup>
        </template>

        <XTabs
          :selected="route.child()?.name"
        >
          <template
            v-for="{ name } in route.children"
            :key="name"
            #[`${name}-tab`]
          >
            <XAction
              :to="{ name }"
            >
              {{ t(`zone-cps.routes.item.navigation.${name}`) }}
            </XAction>
          </template>
        </XTabs>

        <RouterView v-slot="child">
          <component
            :is="child.Component"
            :data="result"
            :subscriptions="error ?? data?.zoneInsight.subscriptions"
          />
        </RouterView>
      </AppView>
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>

import { useZoneActionGroup } from '../'
import { sources } from '../sources'
const ZoneActionGroup = useZoneActionGroup()
</script>
