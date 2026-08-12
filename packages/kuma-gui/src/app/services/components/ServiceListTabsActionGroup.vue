<template>
  <XLayout
    variant="action-group"
  >
    <XActionGroup
      :expanded="true"
    >
      <template
        v-for="{ name } in route.children"
        :key="name"
      >
        <XAction
          :class="{
            'active': route.child()?.name === name,
          }"
          :to="{
            name,
            params: {
              mesh: props.mesh.id,
            },
          }"
          :data-testid="`${name}-sub-tab`"
        >
          {{ t(`services.routes.items.navigation.${name}.label`) }}
        </XAction>
      </template>
    </XActionGroup>
  </XLayout>
</template>

<script setup lang="ts">

import { watch } from 'vue'
import { useRouter, type RouteRecordRaw } from 'vue-router'

import { useI18n } from '@/app/application'
import type { Mesh } from '@/app/meshes/data'

type StringNamedRouteRecordRaw = RouteRecordRaw & {
  name: string
}

const { t } = useI18n()
const router = useRouter()

const props = defineProps<{
  mesh: Mesh
  route: { children: StringNamedRouteRecordRaw[], child: () => StringNamedRouteRecordRaw | undefined }
}>()

watch(() => router.currentRoute.value.name, (val) => {
  if (val === 'service-list-tabs-view') {
    router.replace({ name: 'mesh-service-list-view' })
  }
}, { immediate: true })
</script>
