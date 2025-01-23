<template>
  <RouteView
    name="service-list-tabs-view"
    :params="{
      mesh: '',
    }"
    v-slot="{ route, t }"
  >
    <div
      class="stack"
    >
      <AppView>
        <template #actions>
          <XActionGroup
            :expanded="true"
          >
            <template
              v-for="{ name } in route.children"
              :key="name"
            >
              <XAction
                v-if="!(!can('use service-insights', props.mesh) && ['service-list-view', 'external-service-list-view'].includes(name))"
                :class="{
                  'active': route.child()?.name === name,
                }"
                :to="{
                  name,
                  params: {
                    mesh: route.params.mesh,
                  },
                }"
                :data-testid="`${name}-sub-tab`"
              >
                {{ t(`services.routes.items.navigation.${name}.label`) }}
              </XAction>
            </template>
          </XActionGroup>
        </template>

        <XI18n
          :path="`services.routes.items.navigation.${route.child()?.name}.description`"
          default-message=""
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
    </div>
  </RouteView>
</template>
<script lang="ts" setup>
import { watch } from 'vue'
import { useRouter } from 'vue-router'

import { useCan } from '@/app/application'
import type { Mesh } from '@/app/meshes/data'
const props = defineProps<{
  mesh: Mesh
}>()

const router = useRouter()
const can = useCan()
watch(() => router.currentRoute.value.name, (val) => {
  if (val === 'service-list-tabs-view') {
    router.replace(can('use service-insights', props.mesh) ? { name: 'service-list-view' } : { name: 'mesh-service-list-view' })
  }
}, { immediate: true })
</script>
