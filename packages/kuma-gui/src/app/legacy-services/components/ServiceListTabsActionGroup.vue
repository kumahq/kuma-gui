<template>
  <XLayout
    variant="action-group"
  >
    <XActionGroup
      :expanded="true"
    >
      <template
        v-for="{ name } in (!can('use service-insights', props.mesh) ? route.children.filter(({ name }) => !['service-list-view', 'external-service-list-view'].includes(name)) : route.children)"
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

import { useCan, useI18n } from '@/app/application'
import type { Mesh } from '@/app/meshes/data'

type StringNamedRouteRecordRaw = RouteRecordRaw & {
  name: string
}

const { t } = useI18n()
const can = useCan()
const router = useRouter()

const props = defineProps<{
  mesh: Mesh
  route: { children: StringNamedRouteRecordRaw[], child: () => StringNamedRouteRecordRaw | undefined }
}>()

watch(() => router.currentRoute.value.name, (val) => {
  if (val === 'service-list-tabs-view') {
    can('use service-insights', props.mesh) ? router.replace({ name: 'service-list-view' }) : router.replace({ name: 'mesh-service-list-view' })
  }
}, { immediate: true })
</script>
