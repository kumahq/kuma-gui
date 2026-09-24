<template>
  <RouteView
    name="policy-list-index-view"
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
        v-slot="{ data: meshInsightSource, error: meshInsightError }"
      >
        <DataSource
          :src="uri(resourceSources, '/resource-type-descriptors', {})"
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
              <DataLoader
                :data="[data]"
                :errors="[error]"
                v-slot="{ data: [resourcesData] }"
              >
                <template
                  v-for="legacy in [typeof meshInsightSource?.policies === 'undefined' ? [] : resourcesData.resources.filter(item => {
                    // legacy policies are those that aren't targetRef and are also in use
                    return !item.policy?.isTargetRef && (meshInsightSource.policies?.[item.name]?.total ?? 0) > 0
                  })]"
                  :key="typeof legacy"
                >
                  <template
                    v-for="items in [resourcesData.resources.filter((item) => item.group === 'policy' && (legacy.length > 0 || item.shortName.length > 0))]"
                    :key="typeof items"
                  >
                    <ul>
                      <template
                        v-for="current in [items.find(policyType => [policyType.shortName, policyType.path].includes(route.params.policyPath))]"
                        :key="typeof current"
                      >
                        <li
                          v-for="(policyType, i) in items"
                          :key="policyType.path"
                          :class="{
                            'active': current && (current.shortName === policyType.shortName || current.path === policyType.path),
                          }"
                        >
                          <XAction
                            :to="{
                              name: 'policy-list-view',
                              params: {
                                mesh: route.params.mesh,
                                policyPath: policyType.shortName || policyType.path,
                              },
                            }"
                            :data-testid="`policy-type-link-${policyType.name}`"
                            @vue:mounted="async (vNode) => {
                              if(route.params.policyPath.length === 0 && i === 0 && vNode.props?.to) {
                                await nextTick()
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
                              <DataLoader
                                variant="count"
                                :data="[meshInsightSource]"
                                :errors="[meshInsightError]"
                              >
                                <template #default="{ data: [meshInsight] }">
                                  {{ meshInsight?.policies?.[policyType.name]?.total ?? 0 }}
                                </template>
                                <template #error>
                                  <XIcon
                                    name="warning"
                                  >
                                    {{ t('common.error_state.detail') }}
                                  </XIcon>
                                </template>
                              </DataLoader>
                            </XLayout>
                          </XAction>
                        </li>
                      </template>
                    </ul>
                  </template>
                </template>
              </DataLoader>
            </XCard>
            <div>
              <RouterView v-slot="{ Component }">
                <component
                  :is="Component"
                  :policy-types="data?.resources"
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
import { nextTick } from 'vue'

import { sources as meshSources } from '@/app/meshes/sources'
import { sources as resourceSources } from '@/app/resources/sources'
</script>
<style lang="scss" scoped>
.policy-type-list {
  position: sticky;
  top: calc(var(--kuma-app-top) + var(--x-space-70));
  align-self: flex-start;
  max-width: 500px;

  & + * {
    flex: 1;
  }
}
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
li :deep(a) {
  display: block;
  color: var(--x-color-text-neutral);
  padding: var(--x-space-40) var(--x-space-60);
  text-decoration: none;
  :hover, :focus {
    span:first-of-type {
      text-decoration: underline;
    }
  }
}
li.active :deep(a) {
  background-color: var(--x-color-background-primary-weakest);
  color: currentColor;
}
</style>
