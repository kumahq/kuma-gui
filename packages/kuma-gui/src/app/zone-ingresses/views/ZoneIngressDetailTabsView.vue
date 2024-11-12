<template>
  <RouteView
    name="zone-ingress-detail-tabs-view"
    :params="{
      zone: '',
      zoneIngress: '',
    }"
    v-slot="{ route, t }"
  >
    <DataSource
      :src="`/zone-ingress-overviews/${route.params.zoneIngress}`"
      v-slot="{ data, error }: ZoneIngressOverviewSource"
    >
      <AppView
        :docs="t('zone-ingresses.href.docs')"
        :breadcrumbs="[
          {
            to: {
              name: 'zone-cp-list-view',
            },
            text: t('zone-cps.routes.item.breadcrumbs'),
          },
          {
            to: {
              name: 'zone-cp-detail-view',
              params: {
                zone: route.params.zone,
              },
            },
            text: route.params.zone,
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
          #title
        >
          <h1
            v-if="data"
          >
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
