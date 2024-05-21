<template>
  <RouteView
    v-slot="{ route, t }"
    name="gateway-list-tabs-view"
    :params="{
      mesh: '',
    }"
  >
    <AppView>
      <template #title>
        <h2>
          <RouteTitle :title="t(`${route.child()?.name === 'builtin-gateway-list-view' ? 'builtin' : 'delegated'}-gateways.routes.items.title`)" />
        </h2>
      </template>

      <template #actions>
        <DataCollection
          v-slot="{ items }"
          :items="route.children"
          :empty="false"
        >
          <LinkBox>
            <RouterLink
              v-for="{ name } in items"
              :key="`${name}`"
              :class="{
                'active': route.child()?.name === name,
              }"
              :to="{
                name: name,
                params: {
                  mesh: route.params.mesh,
                },
              }"
              :data-testid="`${name}-sub-tab`"
            >
              {{ t(`gateways.routes.items.navigation.${name}`) }}
            </RouterLink>
          </LinkBox>
        </DataCollection>
      </template>

      <RouterView />
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import LinkBox from '@/app/common/LinkBox.vue'
</script>
