<template>
  <RouteView
    name="delegated-gateway-detail-tabs-view"
    :params="{
      mesh: '',
      service: '',
    }"
    v-slot="{ route, t }"
  >
    <DataSource
      :src="`/meshes/${route.params.mesh}/service-insights/${route.params.service}`"
      v-slot="{ data }: ServiceInsightSource"
    >
      <AppView
        :docs="t('delegated-gateways.href.docs')"
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
              name: 'delegated-gateway-list-view',
              params: {
                mesh: route.params.mesh,
              },
            },
            text: t('delegated-gateways.routes.item.breadcrumbs'),
          },
        ]"
      >
        <template #title>
          <XLayout
            v-if="data"
            size="small"
          >
            <h1>
              <XCopyButton :text="route.params.service">
                <RouteTitle :title="t('delegated-gateways.routes.item.title', { name: route.params.service })" />
              </XCopyButton>
            </h1>
            <template
              v-for="appearance in [{ online: 'success', offline: 'danger', 'partially_degraded': 'warning', 'not_available': 'neutral' }]"
              :key="typeof appearance"
            >
              <XBadge
                class="status-badge"
                :appearance="appearance[data.status] ?? 'neutral'"
                max-width="auto"
                data-testid="status-badge"
              >
                {{ t(`http.api.value.${data.status}`) }}
              </XBadge>
            </template>
          </XLayout>
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
              {{ t(`delegated-gateways.routes.item.navigation.${name}`) }}
            </XAction>
          </template>
        </XTabs>

        <RouterView />
      </AppView>
    </DataSource>
  </RouteView>
</template>

<script setup lang="ts">
import { ServiceInsightSource } from '@/app/services/sources'
</script>
