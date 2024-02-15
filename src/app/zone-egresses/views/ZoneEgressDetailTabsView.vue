<template>
  <RouteView
    v-slot="{ route, can, t }"
    name="zone-egress-detail-tabs-view"
    :params="{
      zone: '',
      zoneEgress: '',
    }"
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
      <template #title>
        <h1>
          <TextWithCopyButton :text="route.params.zoneEgress">
            <RouteTitle
              :title="t('zone-egresses.routes.item.title', { name: route.params.zoneEgress })"
            />
          </TextWithCopyButton>
        </h1>
      </template>

      <DataSource
        v-slot="{ data, error }: ZoneEgressOverviewSource"
        :src="`/zone-egress-overviews/${route.params.zoneEgress}`"
      >
        <ErrorBlock
          v-if="error !== undefined"
          :error="error"
        />

        <LoadingBlock v-else-if="data === undefined" />

        <template v-else>
          <NavTabs
            anchor-route-name="zone-egress-detail-tabs-view"
            i18n-prefix="zone-egresses.routes.item.navigation"
          />

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
import { ZoneEgressOverviewSource } from '../sources'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import NavTabs from '@/app/common/NavTabs.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
</script>
