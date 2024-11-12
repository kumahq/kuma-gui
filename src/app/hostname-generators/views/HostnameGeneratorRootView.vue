<template>
  <RouteView
    name="hostname-generator-root-view"
    v-slot="{ t }"
  >
    <AppView
      :breadcrumbs="[
        {
          to: {
            name: 'hostname-generator-list-view',
          },
          text: t('hostname-generators.routes.item.breadcrumbs'),
        },
      ]"
    >
      <RouterView />
    </AppView>
  </RouteView>
</template>
