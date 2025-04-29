<template>
  <RouteView
    name="control-plane-root-view"
  >
    <AppView>
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

