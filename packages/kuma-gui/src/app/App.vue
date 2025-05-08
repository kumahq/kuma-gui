<template>
  <!-- whilst we don't use the addresses here, -->
  <!-- we want to make sure they are retrieved/correctly set -->
  <DataSource
    :src="`/control-plane/addresses`"
    v-slot="{ data: addresses }: ControlPlaneAddressesSource"
  >
    <RouteView
      v-if="typeof addresses !== 'undefined'"
      name="app"
      :attrs="{
        class: 'kuma-ready',
      }"
      data-testid-root="mesh-app"
      v-slot="{ t, can }"
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
          <AppNavigator
            v-style="'--icon: var(--icon-home)'"
            data-testid="control-planes-navigator"
            :active="child.name === 'control-plane-detail-view'"
            label="Home"
            :to="{
              name: 'control-plane-root-view',
            }"
          />
          <AppNavigator
            v-if="can('use zones')"
            v-style="'--icon: var(--icon-zones)'"
            data-testid="zones-navigator"
            :active="child.name === 'zone-index-view'"
            label="Zones"
            :to="{
              name: 'zone-index-view',
            }"
          />
          <AppNavigator
            v-else
            v-style="'--icon: var(--icon-zone-egresses)'"
            data-testid="zone-egresses-navigator"
            :active="child.name === 'zone-egress-index-view'"
            label="Zone Egresses"
            :to="{
              name: 'zone-egress-list-view',
            }"
          />
          <AppNavigator
            v-style="'--icon: var(--icon-meshes)'"
            :active="child.name === 'mesh-index-view'"
            data-testid="meshes-navigator"
            label="Meshes"
            :to="{
              name: 'mesh-index-view',
            }"
          />
        </template>

        <template #bottomNavigation>
          <AppNavigator
            v-style="'--icon: var(--icon-configuration)'"
            :active="child.name === 'configuration-view'"
            data-testid="configuration-navigator"
            label="Configuration"
            :to="{
              name: 'configuration-view',
            }"
          />
        </template>

        <AppView
          :notifications="true"
        >
          <RouterView
            v-slot="{ Component }"
          >
            <component
              :is="Component"
            />
          </RouterView>
        </AppView>
      </ApplicationShell>
    </RouteView>
  </DataSource>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import AppNavigator from '@/app/application/components/app-navigator/AppNavigator.vue'
import { ControlPlaneAddressesSource } from '@/app/control-planes/sources'
import ApplicationShell from '@/app/kuma/components/ApplicationShell.vue'
import type { RouteRecordRaw } from 'vue-router'

type StringNamedRouteRecordRaw = RouteRecordRaw & {
  name: string
}
const router = useRouter()
const children: StringNamedRouteRecordRaw[] = (router.getRoutes().find((route) => route.name === 'control-plane-root-view')?.children.map(item => {
  item.name = String(item.name)
  return item as StringNamedRouteRecordRaw
}) ?? [])

const child = ref({ name: '' })
router.afterEach(() => {
  const matched = router.currentRoute.value.matched.map(item => item.name)
  const found = children.find((item) => matched.includes(item.name))
  if (found && found.name !== child.value.name) {
    child.value = found
  }
})
</script>

<style lang="scss" scoped>
.logo {
  max-height: 36px;
}

:deep(.app-sidebar) {
  --icon-home: url('@/assets/images/navigation/icon-home.svg');
  --icon-zones: url('@/assets/images/zone.svg');
  --icon-meshes: url('@/assets/images/mesh.svg');
  --icon-configuration: url('@/assets/images/navigation/icon-configuration.svg');
  --icon-zone-egresses: url('@/assets/images/navigation/icon-zone-egresses.svg');
}
</style>
