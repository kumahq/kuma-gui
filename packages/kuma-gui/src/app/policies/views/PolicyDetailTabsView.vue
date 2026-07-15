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
      :src="uri(sources, '/policy-path/:path/policy/:kri', {
        path: route.params.policyPath,
        kri: route.params.policy,
      })"
      v-slot="{ data, result }"
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
        <template #title>
          <DataLoader
            :data="[data]"
            variant="header"
            v-slot="{ data: [policy] }"
          >
            <h1>
              <RouteTitle
                :title="t('policies.routes.item.title', { name: policy.name })"
              />
            </h1>
          </DataLoader>
        </template>
        <template
          #actions
        >
          <PolicyActionGroup
            :item="data"
            :type="{ path: route.params.policyPath }"
            @change="() => route.replace(
              {
                name: 'policy-list-view',
                params: {
                  mesh: route.params.mesh,
                  policyPath: route.params.policyPath,
                },
              },
            )"
          >
            <template
              #control
            >
              <XAction
                action="expand"
                appearance="primary"
              >
                {{ t('policies.action_group.toggle_button') }}
              </XAction>
            </template>
          </PolicyActionGroup>
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
              {{ t(`policies.routes.item.navigation.${name}`) }}
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
import { usePolicyActionGroup } from '../'
import { sources } from '../sources'
const PolicyActionGroup = usePolicyActionGroup()
</script>
