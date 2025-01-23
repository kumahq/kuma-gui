<template>
  <RouteView
    name="gateway-list-tabs-view"
    :params="{
      mesh: '',
    }"
    v-slot="{ route, t }"
  >
    <RouteTitle
      :render="false"
      :title="t(`${route.child()?.name === 'builtin-gateway-list-view' ? 'builtin' : 'delegated'}-gateways.routes.items.title`)"
    />
    <div class="stack">
      <AppView>
        <template #actions>
          <DataCollection
            :items="route.children"
            :empty="false"
            v-slot="{ items }"
          >
            <XActionGroup
              :expanded="true"
            >
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
                {{ t(`gateways.routes.items.navigation.${name}.label`) }}
              </XAction>
            </XActionGroup>
          </DataCollection>
        </template>

        <XI18n
          :path="`gateways.routes.items.navigation.${route.child()?.name}.description`"
          default-message=""
        />

        <RouterView
          v-slot="{ Component}"
        >
          <component
            :is="Component"
          />
        </RouterView>
      </AppView>
    </div>
  </RouteView>
</template>
