<template>
  <RouteView
    v-slot="{ route, t }"
    name="mesh-detail-tabs-view"
    :params="{
      mesh: '',
    }"
  >
    <AppView>
      <template #title>
        <h1>
          <TextWithCopyButton :text="route.params.mesh">
            <RouteTitle
              :title="t('meshes.routes.item.title', { name: route.params.mesh })"
            />
          </TextWithCopyButton>
        </h1>
      </template>

      <NavTabs
        :active-route-name="route.active?.name"
        data-testid="mesh-tabs"
      >
        <template
          v-for="{ name } in route.children.filter(({ name }) => name !== 'external-service-list-view')"
          :key="name"
          #[`${name}`]
        >
          <RouterLink
            :to="{ name }"
            :data-testid="`${name}-tab`"
          >
            {{ t(`meshes.routes.item.navigation.${name}`) }}
          </RouterLink>
        </template>
      </NavTabs>

      <RouterView />
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import NavTabs from '@/app/common/NavTabs.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
</script>
