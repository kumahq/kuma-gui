<template>
  <RouteView
    v-slot="{ route, t }"
    name="service-list-tabs-view"
    :params="{
      mesh: '',
    }"
  >
    <AppView>
      <template #title>
        <XTeleportSlot
          name="service-list-tabs-view-title"
        />
      </template>

      <template #actions>
        <LinkBox>
          <RouterLink
            v-for="{ name } in route.children"
            :key="name"
            :class="{
              'active': route.active?.name === name,
            }"
            :to="{
              name,
              params: {
                mesh: route.params.mesh,
              },
            }"
            :data-testid="`${name}-sub-tab`"
          >
            {{ t(`services.routes.items.navigation.${name}`) }}
          </RouterLink>
        </LinkBox>
      </template>

      <RouterView />
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import LinkBox from '@/app/common/LinkBox.vue'
</script>
