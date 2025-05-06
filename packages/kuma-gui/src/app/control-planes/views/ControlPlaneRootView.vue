<template>
  <RouteView
    name="control-plane-root-view"
    v-slot="{ can }"
  >
    <AppView>
      <XNotification
        :notify="!can('use state')"
        uri="main-overview.notifications.store-memory"
      >
        <XI18n
          path="main-overview.notifications.store-memory"
        />
      </XNotification>
      <RouterView
        v-slot="{ Component }"
      >
        <component
          :is="Component"
        />
      </RouterView>
    </AppView>
  </RouteView>
</template>

