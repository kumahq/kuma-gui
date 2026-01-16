<template>
  <RouteView
    name="workload-detail-tabs-view"
    :params="{
      mesh: '',
      wl: '',
    }"
    v-slot="{ route, t, uri }"
  >
    <DataSource
      :src="uri(sources, '/workloads/:wl', {
        wl: route.params.wl,
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
              name: 'workload-list-view',
              params: {
                mesh: route.params.mesh,
              },
            },
            text: t('workloads.routes.item.breadcrumbs'),
          },
        ]"
      >
        <template
          #title
        >
          <XProgress
            v-if="typeof data === 'undefined'"
            variant="line"
          />
          <XLayout
            v-else
            size="small"
          >
            <h1>
              <XCopyButton
                :text="data.name"
              />
            </h1>
            <XBadge
              :appearance="t(`common.status.appearance.${data.status}`, undefined, { defaultMessage: 'neutral' })"
            >
              {{ t(`http.api.value.${data.status}`) }}
            </XBadge>
          </XLayout>
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
              {{ t(`workloads.routes.item.navigation.${name}`) }}
            </XAction>
          </template>
        </XTabs>

        <RouterView
          v-slot="{ Component }"
        >
          <component
            :is="Component"
            :data="error ?? data"
          />
        </RouterView>
      </AppView>
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>
import { sources } from '@/app/workloads/sources'
</script>
