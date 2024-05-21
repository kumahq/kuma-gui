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
          <XTabs
            :selected="route.child()?.name"
            data-testid="zone-ingress-tabs"
          >
            <template
              v-for="{ name } in route.children"
              :key="name"
              #[`${name}-tab`]
            >
              <XAction
                :to="{ name }"
              >
                {{ t(`zone-ingresses.routes.item.navigation.${name}`) }}
              </XAction>
            </template>
          </XTabs>

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
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
</script>
