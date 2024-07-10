<template>
  <RouteView
    v-slot="{ route, t }"
    name="service-list-tabs-view"
    :params="{
      mesh: '',
    }"
  >
    <div class="stack">
      <div v-html="t('services.routes.items.intro', {}, { defaultMessage: '' })" />
      <AppView>
        <template #actions>
          <XActionGroup
            :expanded="true"
          >
            <XAction
              v-for="{ name } in route.children"
              :key="name"
              :class="{
                'active': route.child()?.name === name,
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
            </XAction>
          </XActionGroup>
        </template>

        <RouterView />
      </AppView>
    </div>
  </RouteView>
</template>
