<template>
  <RouteView
    v-slot="{ route, t }"
    name="data-plane-detail-tabs-view"
    :params="{
      mesh: '',
      dataPlane: '',
    }"
  >
    <AppView
      :breadcrumbs="[
        {
          to: {
            name: 'mesh-detail-view',
            params: {
              mesh: route.params.mesh,
            },
          },
          text: route.params.mesh,
        },
        {
          to: {
            name: 'data-plane-list-view',
            params: {
              mesh: route.params.mesh,
            },
          },
          text: t('data-planes.routes.item.breadcrumbs'),
        },
      ]"
    >
      <template #title>
        <h1>
          <TextWithCopyButton :text="route.params.dataPlane">
            <RouteTitle :title="t('data-planes.routes.item.title', { name: route.params.dataPlane })" />
          </TextWithCopyButton>
        </h1>
      </template>

      <DataSource
        v-slot="{ data, error }: DataplaneOverviewSource"
        :src="`/meshes/${route.params.mesh}/dataplane-overviews/${route.params.dataPlane}`"
      >
        <ErrorBlock
          v-if="error"
          :error="error"
        />

        <LoadingBlock v-else-if="data === undefined" />

        <template v-else>
          <NavTabs :active-route-name="route.active?.name">
            <template
              v-for="{ name } in route.children"
              :key="name"
              #[`${name}`]
            >
              <RouterLink
                :to="{ name }"
                :data-testid="`${name}-tab`"
              >
                {{ t(`data-planes.routes.item.navigation.${name}`) }}
              </RouterLink>
            </template>
          </NavTabs>

          <RouterView v-slot="child">
            <component
              :is="child.Component"
              :data="data"
            />
          </RouterView>
        </template>
      </DataSource>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { DataplaneOverviewSource } from '../sources'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import NavTabs from '@/app/common/NavTabs.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
</script>
