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
        class: 'kuma-ready',
      }"
      data-testid-root="mesh-app"
    >
      <ApplicationShell
        class="kuma-application"
      >
        <template #home>
          <img
            class="logo"
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
          <RouterView />
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
.logo {
  max-height: 36px;
}
</style>
