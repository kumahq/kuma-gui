<template>
  <!-- whilst we don't use the addresses here, -->
  <!-- we want to make sure they are retrieved/correctly set -->
  <DataSource
    v-slot="{data: addresses}: ControlPlaneAddressesSource"
    :src="`/control-plane/addresses`"
  >
    <RouteView
      v-if="typeof addresses !== 'undefined'"
      v-slot="{ t, can, route }"
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
          <template
            v-for="child in [route.child() ?? { name: '' }]"
            :key="child.name"
          >
            <AppNavigator
              data-testid="control-planes-navigator"
              :active="child.name === 'home'"
              label="Home"
              :to="{
                name: 'home',
              }"
            />
            <AppNavigator
              v-if="can('use zones')"
              data-testid="zones-navigator"
              :active="child.name === 'zone-index-view'"
              label="Zones"
              :to="{
                name: 'zone-index-view',
              }"
            />
            <AppNavigator
              v-else
              data-testid="zone-egresses-navigator"
              :active="child.name === 'zone-egress-index-view'"
              label="Zone Egresses"
              :to="{
                name: 'zone-egress-list-view',
              }"
            />
            <AppNavigator
              :active="child.name === 'mesh-index-view'"
              data-testid="meshes-navigator"
              label="Meshes"
              :to="{
                name: 'mesh-index-view',
              }"
            />
          </template>
        </template>

        <AppView>
          <RouterView />
        </AppView>
      </ApplicationShell>
    </RouteView>
  </DataSource>
</template>

<script lang="ts" setup>
import AppNavigator from '@/app/application/components/app-navigator/AppNavigator.vue'
import { ControlPlaneAddressesSource } from '@/app/control-planes/sources'
import ApplicationShell from '@/app/kuma/components/ApplicationShell.vue'

</script>

<style lang="scss" scoped>
.logo {
  max-height: 36px;
}
</style>
