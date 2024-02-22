<template>
  <RouteView
    v-slot="{ route, t }"
    name="zone-ingress-detail-tabs-view"
    :params="{
      zone: '',
      zoneIngress: '',
    }"
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
      <template #title>
        <h1>
          <TextWithCopyButton :text="route.params.zoneIngress">
            <RouteTitle
              :title="t('zone-ingresses.routes.item.title', { name: route.params.zoneIngress })"
            />
          </TextWithCopyButton>
        </h1>
      </template>

      <DataSource
        v-slot="{ data, error }: ZoneIngressOverviewSource"
        :src="`/zone-ingress-overviews/${route.params.zoneIngress}`"
      >
        <ErrorBlock
          v-if="error !== undefined"
          :error="error"
        />

        <LoadingBlock v-else-if="data === undefined" />

        <template v-else>
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
        </template>
      </DataSource>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { ZoneIngressOverviewSource } from '../sources'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import NavTabs from '@/app/common/NavTabs.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
</script>
