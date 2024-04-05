<template>
  <RouteView
    v-slot="{ route, t }"
    name="zone-ingress-detail-tabs-view"
    :params="{
      zone: '',
      zoneIngress: '',
    }"
  >
    <DataSource
      v-slot="{ data, error }: ZoneIngressOverviewSource"
      :src="`/zone-ingress-overviews/${route.params.zoneIngress}`"
    >
      <AppView
        :breadcrumbs="[
          {
            to: {
              name: 'zone-cp-list-view',
            },
            text: t('zone-cps.routes.item.breadcrumbs'),
          },
          {
            to: {
              name: 'zone-ingress-list-view',
              params: {
                zone: route.params.zone,
              },
            },
            text: t('zone-ingresses.routes.item.breadcrumbs'),
          },
        ]"
      >
        <template
          v-if="data"
          #title
        >
          <h1>
            <TextWithCopyButton
              :text="data.name"
            >
              <RouteTitle
                :title="t('zone-ingresses.routes.item.title', { name: data.name })"
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
            data-testid="zone-ingress-tabs"
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
                {{ t(`zone-ingresses.routes.item.navigation.${name}`) }}
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
import type { ZoneIngressOverviewSource } from '../sources'
import NavTabs from '@/app/common/NavTabs.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
</script>
