<template>
  <RouteView
    name="policy-list-view"
    :params="{
      mesh: '',
      policyPath: '',
      policy: '',
    }"
    v-slot="{ route, t }"
  >
    <RouteTitle
      :render="false"
      :title="t('policies.routes.types.title')"
    />
    <AppView>
      <DataSource
        :src="`/mesh-insights/${route.params.mesh}`"
        v-slot="{ data: meshInsight }: MeshInsightSource"
      >
        <DataSource
          :src="`/policy-types`"
          v-slot="{ data, error }: PolicyTypeCollectionSource"
        >
          <div
            class="policy-list-content"
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
                  v-for="legacy in [typeof meshInsight?.policies === 'undefined' ? data!.policies : data!.policies.filter(item => {
                    // legacy policies are those that aren't targetRef and are also in use
                    return !item.isTargetRefBased && (meshInsight.policies?.[item.name]?.total ?? 0) > 0
                  })]"
                  :key="legacy"
                >
                  <DataCollection
                    :predicate="typeof meshInsight?.policies === 'undefined' ? undefined : (item) => legacy.length > 0 || item.isTargetRefBased"
                    :items="data!.policies"
                    v-slot="{ items }"
                  >
                    <template
                      v-for="current in [items.find(policyType => policyType.path === route.params.policyPath)]"
                      :key="current"
                    >
                      <div
                        v-for="(policyType, i) in items"
                        :key="policyType.path"
                        class="policy-type-link-wrapper"
                        :class="{
                          'policy-type-link-wrapper--is-active': current && current.path === policyType.path,
                        }"
                      >
                        <XAction
                          class="policy-type-link"
                          :to="{
                            name: 'policy-list-view',
                            params: {
                              mesh: route.params.mesh,
                              policyPath: policyType.path,
                            },
                          }"
                          :mount="route.params.policyPath.length === 0 && i === 0 ? route.replace : undefined"
                          :data-testid="`policy-type-link-${policyType.name}`"
                        >
                          {{ policyType.name }}
                        </XAction>

                        <div class="policy-count">
                          {{ meshInsight?.policies?.[policyType.name]?.total ?? 0 }}
                        </div>
                      </div>
                    </template>
                  </DataCollection>
                </template>
              </DataLoader>
            </XCard>
            <div class="policy-list">
              <RouterView v-slot="{ Component }">
                <component
                  :is="Component"
                  :policy-types="data?.policies"
                />
              </RouterView>
            </div>
          </div>
        </DataSource>
      </DataSource>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { MeshInsightSource } from '@/app/meshes/sources'
import type { PolicyTypeCollectionSource } from '@/app/policies/sources'
</script>
<style lang="scss">
.policy-type-link {
  color: currentColor;
  flex-grow: 1;
  padding: $kui-space-40 $kui-space-60;
}

</style>
<style lang="scss" scoped>
.policy-list-content {
  display: flex;
  gap: $kui-space-80;
}

.policy-type-list {
  position: sticky;
  top: calc(var(--AppHeaderHeight) + $kui-space-70);
  align-self: flex-start;
  max-width: 500px;
}

.policy-list {
  flex-grow: 1;
}
.policy-type-link-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: $kui-space-60;
}

.policy-type-link-wrapper--is-active {
  background-color: $kui-color-background-primary-weakest;
}

.policy-type-link-wrapper:not(.policy-type-link-wrapper--is-active) {
  color: $kui-color-text-neutral;
}

.policy-count {
  text-align: right;
  padding-right: $kui-space-60;
}

</style>
