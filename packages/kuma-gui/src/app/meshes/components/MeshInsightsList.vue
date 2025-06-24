<template>
  <div>
    <DataCollection
      :items="props.items"
      type="meshes"
    >
      <AppCollection
        :headers="[
          { ...storage.get('mesh.headers.name') ,label: t('meshes.components.mesh-insights-list.name'), key: 'name'},
          { ...storage.get('mesh.headers.services') ,label: t('meshes.components.mesh-insights-list.services'), key: 'services'},
          { ...storage.get('mesh.headers.dataplanes') ,label: t('meshes.components.mesh-insights-list.dataplanes'), key: 'dataplanes'},
        ]"
        :items="props.items"
        @resize="(obj) => {
          storage.set({
            mesh: obj,
          })
        }"
      >
        <template
          #name="{ row: item }"
        >
          <XAction
            :to="{
              name: 'mesh-detail-view',
              params: {
                mesh: item.name,
              },
            }"
          >
            {{ item.name }}
          </XAction>
        </template>

        <template
          #services="{ row: item }"
        >
          {{ item.services.internal }}
        </template>

        <template
          #dataplanes="{ row: item }"
        >
          {{ item.dataplanesByType.standard.online }} / {{ item.dataplanesByType.standard.total }}
        </template>
      </AppCollection>
    </DataCollection>
  </div>
</template>

<script lang="ts" setup>
import type { MeshInsight } from '../data'
import { useI18n } from '@/app/application'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'

const { t } = useI18n()

const props = withDefaults(defineProps<{
  items: MeshInsight[]
  storage?: {
    get: (uri: string) => {}
    set: (data: any) => void
  }
}>(), {
  storage: () => ({
    get: () => ({}),
    set: () => {},
  }),
})
</script>
