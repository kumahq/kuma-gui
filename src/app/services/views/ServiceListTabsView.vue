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
        <h2>
          <RouteTitle
            :title="t(`${route.active?.name === 'service-list-view' ? '' : 'external-'}services.routes.items.title`)"
          />
        </h2>
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
