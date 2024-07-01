<template>
  <RouteView
    v-slot="{ route, t }"
    name="gateway-list-tabs-view"
    :params="{
      mesh: '',
    }"
  >
    <RouteTitle
      :render="false"
      :title="t(`${route.child()?.name === 'builtin-gateway-list-view' ? 'builtin' : 'delegated'}-gateways.routes.items.title`)"
    />
    <AppView>
      <template #actions>
        <DataCollection
          v-slot="{ items }"
          :items="route.children"
          :empty="false"
        >
          <XActionGroup>
            <XAction
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
            </XAction>
          </XActionGroup>
        </DataCollection>
      </template>

      <RouterView
        v-slot="{ Component}"
      >
        <component
          :is="Component"
        />
      </RouterView>
    </AppView>
  </RouteView>
</template>
