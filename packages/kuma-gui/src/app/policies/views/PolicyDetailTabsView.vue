<template>
  <RouteView
    name="policy-detail-tabs-view"
    :params="{
      mesh: '',
      policy: '',
      policyPath: '',
    }"
    v-slot="{ route, t, uri }"
  >
    <DataSource
      :src="uri(sources, '/meshes/:mesh/policy-path/:path/policy/:name', {
        mesh: route.params.mesh,
        path: route.params.policyPath,
        name: route.params.policy,
      })"
      v-slot="{ data, error }"
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
              name: 'policy-list-view',
              params: {
                mesh: route.params.mesh,
                policyPath: route.params.policyPath,
              },
            },
            text: t('policies.routes.item.breadcrumbs'),
          },
        ]"
      >
        <template
          #title
        >
          <h1
            v-if="data"
          >
            <XCopyButton
              :text="data.name"
            >
              <RouteTitle
                :title="t('policies.routes.item.title', { name: data.name })"
              />
            </XCopyButton>
          </h1>
        </template>

        <DataLoader
          :data="[data]"
          :errors="[error]"
        >
          <XTabs
            :selected="route.child()?.name"
          >
            <template
              v-for="{ name } in route.children"
              :key="name"
              #[`${name}-tab`]
            >
              <XAction
                :to="{ name }"
              >
                {{ t(`policies.routes.item.navigation.${name}`) }}
              </XAction>
            </template>
          </XTabs>

          <RouterView
            v-slot="child"
          >
            <component
              :is="child.Component"
              :data="data"
            />
          </RouterView>
        </DataLoader>
      </AppView>
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>
import { sources } from '../sources'
</script>
