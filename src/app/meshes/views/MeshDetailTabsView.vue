<template>
  <RouteView
    v-slot="{ route, t }"
    name="mesh-detail-tabs-view"
    :params="{
      mesh: '',
    }"
  >
    <AppView>
      <template #title>
        <h1>
          <TextWithCopyButton :text="route.params.mesh">
            <RouteTitle
              :title="t('meshes.routes.item.title', { name: route.params.mesh })"
            />
          </TextWithCopyButton>
        </h1>
      </template>

      <NavTabs
        :children="route.children"
        :active="route.active"
        i18n-prefix="meshes.routes.item.navigation"
        :filter-predicate="(route) => route.name !== 'external-service-list-view'"
        data-testid="mesh-tabs"
      />

      <RouterView />
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import NavTabs from '@/app/common/NavTabs.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
</script>
