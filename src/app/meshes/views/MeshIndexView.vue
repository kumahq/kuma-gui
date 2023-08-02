<template>
  <RouteView>
    <AppView
      :breadcrumbs="[
        {
          to: {
            name: 'mesh-list-view'
          },
          text: t('meshes.routes.item.breadcrumbs'),
        },
        ...(route.name !== 'mesh-detail-view' ? [{
          to: {
            name: 'mesh-detail-view',
            params: {
              mesh: route.params.mesh,
            },
          },
          text: route.params.mesh as string,
        }] : []),
      ]"
    >
      <template #title>
        <h1>
          <RouteTitle
            :title="t('meshes.routes.item.title', { name: route.params.mesh as string })"
            :render="true"
          />
        </h1>
      </template>

      <RouterView v-slot="child">
        <component
          :is="child.Component"
          :key="child.route.path"
        />
      </RouterView>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'

import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import { useStore } from '@/store/store'
import { useI18n } from '@/utilities'

const { t } = useI18n()
const route = useRoute()
const store = useStore()

// Updates the policy type totals based on the current mesh.
watch(() => route.params.mesh, (newMesh, oldMesh) => {
  if (newMesh !== oldMesh && newMesh) {
    store.dispatch('fetchPolicyTypeTotals', newMesh)
  }
}, { immediate: true })
</script>
