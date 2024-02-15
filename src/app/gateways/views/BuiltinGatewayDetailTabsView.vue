<template>
  <RouteView
    v-slot="{ route, t }"
    name="builtin-gateway-detail-tabs-view"
    :params="{
      mesh: '',
      gateway: '',
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
            name: 'builtin-gateway-list-view',
            params: {
              mesh: route.params.mesh,
            },
          },
          text: t('builtin-gateways.routes.item.breadcrumbs'),
        },
      ]"
    >
      <template #title>
        <h1>
          <TextWithCopyButton :text="route.params.gateway">
            <RouteTitle :title="t('builtin-gateways.routes.item.title', { name: route.params.gateway })" />
          </TextWithCopyButton>
        </h1>
      </template>

      <NavTabs
        anchor-route-name="builtin-gateway-detail-tabs-view"
        i18n-prefix="builtin-gateways.routes.item.navigation"
      />

      <RouterView />
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import NavTabs from '@/app/common/NavTabs.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
</script>
