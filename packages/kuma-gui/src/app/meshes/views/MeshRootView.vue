<template>
  <RouteView
    name="mesh-index-view"
    v-slot="{ t }"
  >
    <AppView
      :breadcrumbs="[
        {
          to: {
            name: 'mesh-list-view',
          },
          text: t('meshes.routes.item.breadcrumbs'),
        },
      ]"
    >
      <RouterView />
    </AppView>
  </RouteView>
</template>
