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

      <XTabs
        :selected="route.active?.name"
      >
        <template
          v-for="{ name } in route.children"
          :key="name"
          #[`${name}-tab`]
        >
          <XAction
            :to="{ name }"
          >
            {{ t(`builtin-gateways.routes.item.navigation.${name}`) }}
          </XAction>
        </template>
      </XTabs>

      <RouterView />
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
</script>
