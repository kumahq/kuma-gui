<template>
  <!-- whilst we don't use the addresses here, -->
  <!-- we want to make sure they are retrieved/correctly set -->
  <DataSource
    v-slot="{data: addresses}: ControlPlaneAddressesSource"
    :src="`/control-plane/addresses`"
  >
    <RouteView
      v-if="typeof addresses !== 'undefined'"
      v-slot="{ t, can }"
      name="app"
      :attrs="{
        class: 'kuma-ready'
      }"
    >
      <ApplicationShell
        class="kuma-application"
      >
        <template #home>
          <img
            src="@/assets/images/product-logo.png"
            :alt="`${t('common.product.name')} Logo`"
            data-testid="logo"
          >
        </template>

        <template #navigation>
          <ControlPlaneNavigator />
          <ZoneNavigator
            v-if="can('use zones')"
          />
          <ZoneEgressNavigator
            v-else
          />
          <MeshNavigator />
        </template>

        <AppView>
          <RouterView v-slot="{ Component }">
            <transition
              mode="out-in"
              name="fade"
            >
              <div class="transition-root">
                <component
                  :is="Component"
                />
              </div>
            </transition>
          </RouterView>
        </AppView>
      </ApplicationShell>
    </RouteView>
  </DataSource>
</template>
<script lang="ts" setup>
import ControlPlaneNavigator from '@/app/control-planes/components/ControlPlaneNavigator.vue'
import { ControlPlaneAddressesSource } from '@/app/control-planes/sources'
import ApplicationShell from '@/app/kuma/components/ApplicationShell.vue'
import MeshNavigator from '@/app/meshes/components/MeshNavigator.vue'
import ZoneEgressNavigator from '@/app/zone-egresses/components/ZoneEgressNavigator.vue'
import ZoneNavigator from '@/app/zones/components/ZoneNavigator.vue'
</script>
<style lang="scss" scoped>
.app-content-container {
  padding-top: var(--AppHeaderHeight, initial);
  display: var(--AppDisplay);
  // Note: `minmax(0, 1fr)` is used because `1fr` implies `minmax(auto, 1fr)` which will allow grid items to grow beyond their container's size.
  grid-template-columns: var(--AppSidebarWidth) minmax(0, 1fr);
}
img {
  max-height: 36px;
}
</style>
