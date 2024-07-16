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
      <div v-html="t('gateways.routes.items.intro', {}, { defaultMessage: '' })" />
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
    </div>
  </RouteView>
</template>
