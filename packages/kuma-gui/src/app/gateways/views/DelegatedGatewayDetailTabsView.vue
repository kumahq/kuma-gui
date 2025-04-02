<template>
  <RouteView
    name="delegated-gateway-detail-tabs-view"
    :params="{
      mesh: '',
      service: '',
    }"
    v-slot="{ route, t }"
  >
    <AppView
      :docs="t('delegated-gateways.href.docs')"
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
            name: 'delegated-gateway-list-view',
            params: {
              mesh: route.params.mesh,
            },
          },
          text: t('delegated-gateways.routes.item.breadcrumbs'),
        },
      ]"
    >
      <template
        #title
      >
        <h1>
          <XCopyButton
            :text="route.params.service"
          >
            <RouteTitle
              :title="t('delegated-gateways.routes.item.title', { name: route.params.service })"
            />
          </XCopyButton>
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
            {{ t(`delegated-gateways.routes.item.navigation.${name}`) }}
          </XAction>
        </template>
      </XTabs>

      <RouterView />
    </AppView>
  </RouteView>
</template>
