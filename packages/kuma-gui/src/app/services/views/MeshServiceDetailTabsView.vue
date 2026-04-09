<template>
  <RouteView
    name="mesh-service-detail-tabs-view"
    :params="{
      mesh: '',
      service: '',
    }"
    v-slot="{ route, t, uri }"
  >
    <DataSource
      :src="uri(sources, '/meshes/:mesh/mesh-service/:name', {
        mesh: route.params.mesh,
        name: route.params.service,
      })"
      v-slot="{ data, result }"
    >
      <AppView
        :docs="t('services.mesh-service.href.docs')"
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
              name: 'mesh-service-list-view',
              params: {
                mesh: route.params.mesh,
              },
            },
            text: t('services.routes.mesh-service-list-view.title'),
          },
        ]"
      >
        <template #title>
          <DataLoader
            :data="[data]"
            variant="header"
            v-slot="{ data: [service] }"
          >
            <XLayout
              variant="y-stack"
              size="small"
            >
              <h1>
                <XCopyButton :text="service.name">
                  <RouteTitle
                    :title="t('services.routes.item.title', { name: service.name })"
                  />
                </XCopyButton>
              </h1>
              <XBadge
                :appearance="t(`common.status.appearance.${service.spec.state}`, undefined, { defaultMessage: 'neutral' })"
              >
                {{ t(`http.api.value.${service.spec.state}`) }}
              </XBadge>
            </XLayout>
          </DataLoader>
        </template>

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
              {{ t(`services.routes.item.navigation.${name}`) }}
            </XAction>
          </template>
        </XTabs>

        <RouterView
          v-slot="child"
        >
          <component
            :is="child.Component"
            :data="result"
          />
        </RouterView>
      </AppView>
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>
import { sources } from '../sources'
</script>
