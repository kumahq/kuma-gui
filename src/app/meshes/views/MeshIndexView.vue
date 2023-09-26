<template>
  <RouteView
    v-slot="{ t }"
    name="mesh-index-view"
  >
    <AppView
      :breadcrumbs="[
        {
          to: {
            name: 'mesh-list-view'
          },
          text: t('meshes.routes.item.breadcrumbs'),
        },
      ]"
    >
      <RouterView />
    </AppView>
  </RouteView>
</template>
