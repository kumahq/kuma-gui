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
      v-slot="{ data, error, refresh }"
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
          <template v-if="data">
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
          <template v-else>
            <XProgress variant="line" />
          </template>
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
        <DataLoader
          :errors="[error]"
          :loader="false"
        >
          <template
            v-if="error"
            #error
          >
            <XCard>
              <ErrorBlock :error="error" />
            </XCard>
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
              :source="{ data, error, refresh }"
            />
          </RouterView>
        </DataLoader>
      </AppView>
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>
import { KUI_ICON_SIZE_50 } from '@kong/design-tokens'

import { useZoneActionGroup } from '../'
import { sources } from '../sources'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
const ZoneActionGroup = useZoneActionGroup()
</script>
