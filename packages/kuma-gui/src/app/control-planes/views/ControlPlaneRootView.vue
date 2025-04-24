<template>
  <RouteView
    name="home"
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

