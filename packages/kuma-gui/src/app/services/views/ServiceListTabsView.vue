<template>
  <RouteView
    name="service-list-tabs-view"
    :params="{
      mesh: '',
    }"
    v-slot="{ route }"
  >
    <AppView>
      <ServiceListTabsActionGroup
        :route="route"
        :mesh="props.mesh"
      />

      <XI18n
        :path="`services.routes.items.navigation.${route.child()?.name}.description`"
        default-path="common.i18n.ignore-error"
      />

      <RouterView
        v-slot="{ Component }"
      >
        <component
          :is="Component"
          :mesh="props.mesh"
        />
      </RouterView>
    </AppView>
  </RouteView>
</template>
<script lang="ts" setup>
import { useServiceListTabsActionGroup } from '..'
import type { Mesh } from '@/app/meshes/data'
const props = defineProps<{
  mesh: Mesh
}>()
const ServiceListTabsActionGroup = useServiceListTabsActionGroup()
</script>
