<template>
  <RouteView
    v-slot="{ route, can, t }"
    name="zone-egress-detail-tabs-view"
    :params="{
      zone: '',
      zoneEgress: '',
    }"
  >
    <DataSource
      v-slot="{ data, error }: ZoneEgressOverviewSource"
      :src="`/zone-egress-overviews/${route.params.zoneEgress}`"
    >
      <AppView
        :breadcrumbs="[
          ...(can('use zones') ? [{
            to: {
              name: 'zone-cp-list-view',
            },
            text: t('zone-cps.routes.item.breadcrumbs'),
          }] : []),
          {
            to: {
              name: 'zone-egress-list-view',
              params: {
                zone: route.params.zone,
              },
            },
            text: t('zone-egresses.routes.item.breadcrumbs'),
          },
        ]"
      >
        <template
          v-if="data"
          #title
        >
          <h1>
            <TextWithCopyButton :text="data.name">
              <RouteTitle
                :title="t('zone-egresses.routes.item.title', { name: data.name })"
              />
            </TextWithCopyButton>
          </h1>
        </template>

        <DataLoader
          :data="[data]"
          :errors="[error]"
        >
          <NavTabs
            :active-route-name="route.active?.name"
          >
            <template
              v-for="{ name } in route.children"
              :key="name"
              #[`${name}`]
            >
              <RouterLink
                :to="{ name }"
                :data-testid="`${name}-tab`"
              >
                {{ t(`zone-egresses.routes.item.navigation.${name}`) }}
              </RouterLink>
            </template>
          </NavTabs>

          <RouterView v-slot="child">
            <component
              :is="child.Component"
              :data="data"
            />
          </RouterView>
        </DataLoader>
      </AppView>
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>
import { ZoneEgressOverviewSource } from '../sources'
import NavTabs from '@/app/common/NavTabs.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
</script>
