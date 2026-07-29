<template>
  <RouteView
    name="policy-detail-tabs-view"
    :params="{
      mesh: '',
      policy: '',
    }"
    v-slot="{ route, t, uri }"
  >
    <DataLoader
      :src="uri(sources, '/policy-types', {})"
      v-slot="{ data: [policyTypesData] }"
    >
      <template
        v-for="policyType in [policyTypesData.policyTypes.find((policyType) => {
          const { shortName } = Kri.fromString(route.params.policy)
          return shortName.startsWith('~') ? policyType.name.toLowerCase() === shortName.substring(1) : policyType.shortName === shortName
        })]"
        :key="typeof policyType"
      >
        <DataSource
          :src="uri(sources, '/policy-path/:path/policy/:kri', {
            path: policyType?.path ?? '',
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
                    policyPath: policyType?.path,
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
                :type="{ path: policyType?.path }"
                @change="() => route.replace(
                  {
                    name: 'policy-list-view',
                    params: {
                      mesh: route.params.mesh,
                      policyPath: policyType?.path,
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
                :policy-type="policyType"
              />
            </RouterView>
          </AppView>
        </DataSource>
      </template>
    </DataLoader>
  </RouteView>
</template>

<script lang="ts" setup>
import { usePolicyActionGroup } from '../'
import { sources } from '../sources'
import { Kri } from '@/app/kuma'
const PolicyActionGroup = usePolicyActionGroup()
</script>
