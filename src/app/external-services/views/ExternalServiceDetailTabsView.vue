<template>
  <RouteView
    v-slot="{ route, t }"
    name="external-service-detail-tabs-view"
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
            name: 'external-service-list-view',
            params: {
              mesh: route.params.mesh,
            },
          },
          text: t('external-services.routes.item.breadcrumbs'),
        },
      ]"
    >
      <template #title>
        <h1>
          <TextWithCopyButton :text="route.params.service">
            <RouteTitle :title="t('external-services.routes.item.title', { name: route.params.service })" />
          </TextWithCopyButton>
        </h1>
      </template>

      <NavTabs
        anchor-route-name="external-service-detail-tabs-view"
        i18n-prefix="external-services.routes.item.navigation"
      />

      <RouterView />
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import NavTabs from '@/app/common/NavTabs.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
</script>
