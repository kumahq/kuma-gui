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
      <div v-html="t('services.routes.items.intro', {}, { defaultMessage: '' })" />
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
                v-if="!(props.mesh.meshServices?.enabled === 'Exclusive' && ['service-list-view', 'external-service-list-view'].includes(name))"
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
                {{ t(`services.routes.items.navigation.${name}`) }}
              </XAction>
            </template>
          </XActionGroup>
        </template>

        <RouterView />
      </AppView>
    </div>
  </RouteView>
</template>
<script lang="ts" setup>
import { watch } from 'vue'
import { useRouter } from 'vue-router'

import type { Mesh } from '@/app/meshes/data'
const router = useRouter()
const props = defineProps<{
  mesh: Mesh
}>()
watch(() => router.currentRoute.value.name, (val) => {
  if (val === 'service-list-tabs-view') {
    router.replace(props.mesh.meshServices?.enabled === 'Exclusive' ? { name: 'mesh-service-list-view' } : { name: 'service-list-view' })
  }
}, { immediate: true })
</script>
