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
            {{ t(`services.routes.item.navigation.${name}`) }}
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
