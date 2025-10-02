<template>
  <RouteView
    name="zone-cp-detail-tabs-view"
    :params="{
      zone: '',
    }"
    v-slot="{ route, t, uri }"
  >
    <DataLoader
      :src="uri(sources, `/zone-cps/:name`, {
        name: route.params.zone,
      })"
      v-slot="{ data }"
    >
      <AppView
        v-if="data"
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
          <XLayout size="small">
            <XLayout type="separated">
              <template
                v-for="env in [(['kubernetes', 'universal'] as const).find(env => env === data.zoneInsight.environment) ?? 'kubernetes']"
                :key="env"
              >
                <XIcon
                  :name="env"
                  :size="KUI_ICON_SIZE_50"
                >
                  {{ t(`common.product.environment.${env}`) }}
                </XIcon>
              </template>
              <h1>
                <XCopyButton :text="route.params.zone">
                  <RouteTitle
                    :title="t('zone-cps.routes.item.title', { name: route.params.zone })"
                  />
                </XCopyButton>
              </h1>
            </XLayout>
            <XBadge
              :appearance="t(`common.status.appearance.${data.state}`, undefined, { defaultMessage: 'neutral' })"
            >
              {{ t(`http.api.value.${data.state}`) }}
            </XBadge>
          </XLayout>
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
            :data="data"
            :subscriptions="data.zoneInsight.subscriptions"
          />
        </RouterView>
      </AppView>
    </DataLoader>
  </RouteView>
</template>

<script lang="ts" setup>
import { KUI_ICON_SIZE_50 } from '@kong/design-tokens'

import { useZoneActionGroup } from '../'
import { sources } from '../sources'
const ZoneActionGroup = useZoneActionGroup()
</script>
