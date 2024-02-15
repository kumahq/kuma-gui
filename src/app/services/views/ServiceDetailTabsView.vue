<template>
  <RouteView
    v-slot="{ route, t }"
    name="service-detail-tabs-view"
    :params="{
      mesh: '',
      service: '',
    }"
  >
    <AppView
      :breadcrumbs="[
        {
          to: {
            name: 'mesh-detail-view',
            params: {
              mesh: route.params.mesh,
            },
          },
          text: route.params.mesh,
        },
        {
          to: {
            name: 'service-list-view',
            params: {
              mesh: route.params.mesh,
            },
          },
          text: t('services.routes.item.breadcrumbs'),
        },
      ]"
    >
      <template #title>
        <h1>
          <TextWithCopyButton :text="route.params.service">
            <RouteTitle
              :title="t('services.routes.item.title', { name: route.params.service })"
            />
          </TextWithCopyButton>
        </h1>
      </template>

      <DataSource
        v-slot="{ data, error }: ServiceInsightSource"
        :src="`/meshes/${route.params.mesh}/service-insights/${route.params.service}`"
      >
        <ErrorBlock
          v-if="error"
          :error="error"
        />

        <LoadingBlock v-else-if="data === undefined" />

        <template v-else>
          <NavTabs
            anchor-route-name="service-detail-tabs-view"
            i18n-prefix="services.routes.item.navigation"
            :filter-predicate="(route) => {
              if (data.serviceType !== 'external' && route.name === 'service-config-view') {
                return false
              }

              if (data.serviceType === 'external' && route.name === 'service-data-plane-proxies-view') {
                return false
              }

              return true
            }"
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
import type { ServiceInsightSource } from '../sources'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import NavTabs from '@/app/common/NavTabs.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
</script>
