<template>
  <RouteView
    name="policy-list-view"
    :params="{
      mesh: '',
      policyPath: '',
      policy: '',
    }"
    v-slot="{ uri, route, t }"
  >
    <RouteTitle
      :render="false"
      :title="t('policies.routes.types.title')"
    />
    <AppView>
      <DataSource
        :src="uri(meshSources, '/mesh-insights/:name', {
          name: route.params.mesh,
        }, {})"
        v-slot="{ data: meshInsight }"
      >
        <DataSource
          :src="uri(sources, '/policy-types', {})"
          v-slot="{ data, error }"
        >
          <XLayout
            variant="x-stack"
            size="large"
          >
            <XCard
              class="policy-type-list"
              data-testid="policy-type-list"
            >
              <!-- block on policy types but not meshInsight -->
              <DataLoader
                :data="[data]"
                :errors="[error]"
              >
                <template
                  v-for="legacy in [typeof meshInsight?.policies === 'undefined' ? data!.policyTypes : data!.policyTypes.filter(item => {
                    // legacy policies are those that aren't targetRef and are also in use
                    return !item.policy.isTargetRef && (meshInsight.policies?.[item.name]?.total ?? 0) > 0
                  })]"
                  :key="typeof legacy"
                >
                  <DataCollection
                    :predicate="typeof meshInsight?.policies === 'undefined' ? undefined : (item) => legacy.length > 0 || item.policy.isTargetRef"
                    :items="data!.policyTypes"
                    v-slot="{ items }"
                  >
                    <ul>
                      <template
                        v-for="current in [items.find(policyType => policyType.path === route.params.policyPath)]"
                        :key="current"
                      >
                        <li
                          v-for="(policyType, i) in items"
                          :key="policyType.path"
                          :class="{
                            'active': current && current.path === policyType.path,
                          }"
                        >
                          <XAction
                            :to="{
                              name: 'policy-list-view',
                              params: {
                                mesh: route.params.mesh,
                                policyPath: policyType.path,
                              },
                            }"
                            :data-testid="`policy-type-link-${policyType.name}`"
                            @vue:mounted="(vNode) => {
                              if(route.params.policyPath.length === 0 && i === 0 && vNode.props?.to) {
                                route.replace(vNode.props.to)
                              }
                            }"
                          >
                            <XLayout
                              variant="x-stack"
                              justify="between"
                            >
                              <span>
                                {{ policyType.name }}
                              </span>
                              <span>
                                {{ meshInsight?.policies?.[policyType.name]?.total ?? 0 }}
                              </span>
                            </XLayout>
                          </XAction>
                        </li>
                      </template>
                    </ul>
                  </DataCollection>
                </template>
              </DataLoader>
            </XCard>
            <div>
              <RouterView v-slot="{ Component }">
                <component
                  :is="Component"
                  :policy-types="data?.policyTypes"
                />
              </RouterView>
            </div>
          </XLayout>
        </DataSource>
      </DataSource>
    </AppView>
  </RouteView>
</template>
<script lang="ts" setup>
import { sources as meshSources } from '@/app/meshes/sources'
import { sources } from '@/app/policies/sources'
</script>
<style lang="scss" scoped>
.policy-type-list {
  position: sticky;
  top: calc(var(--AppHeaderHeight) + $kui-space-70);
  align-self: flex-start;
  max-width: 500px;
}
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
li :deep(a) {
  display: block;
  color: $kui-color-text-neutral;
  padding: $kui-space-40 $kui-space-60;
  text-decoration: none;
  :hover, :focus {
    span:first-of-type {
      text-decoration: underline;
    }
  }
}
li.active :deep(a) {
  background-color: $kui-color-background-primary-weakest;
  color: currentColor;
}
</style>
