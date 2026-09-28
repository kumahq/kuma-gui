<template>
  <RouteView
    name="control-plane-resource-type-list-view"
    :params="{
      shortName: '',
    }"
    v-slot="{ uri, route, t }"
  >
    <AppView>
      <template #title>
        <h1>
          <RouteTitle
            :title="t('resources.routes.items.title')"
          />
        </h1>
      </template>
      <DataSource
        :src="uri(sources, '/resource-type-descriptors', {})"
        v-slot="{ data: sourceResources, error: resourcesError }"
      >
        <DataSource
          :src="uri(controlPlanesSources, '/global-insight', {})"
          v-slot="{ data: sourceGlobalInsight, error: globalInsightError }"
        >
          <XLayout
            variant="x-stack"
            size="large"
          >
            <XCard class="resource-type-collection">
              <DataLoader
                :data="[sourceResources, sourceGlobalInsight]"
                :errors="[resourcesError, globalInsightError]"
                v-slot="{ data: [resources, globalInsight] }"
              >
                <XLayout
                  v-for="filtered in [resources.resources.filter((item) =>
                    item.group === 'global' && item.shortName.length > 0,
                  )]"
                  :key="typeof filtered"
                  variant="y-stack"
                >
                  <DataCollection
                    :items="filtered"
                  >
                    <template #default="{ items }">
                      <ul>
                        <li
                          v-for="(item, j) in items"
                          :key="item.name"
                          :class="{
                            'active': item.shortName === route.params.shortName,
                          }"
                        >
                          <XAction
                            :to="{
                              name: 'control-plane-resource-list-view',
                              params: {
                                shortName: item.shortName,
                              },
                            }"
                            :data-testid="`resource-type-link-${item.name}`"
                            @vue:mounted="(vNode) => {
                              if((route.params.shortName.length === 0 || !resources.resources.find((resource) => resource.shortName === route.params.shortName)) && j === 0 && vNode.props?.to) {
                                $nextTick(() => {
                                  route.replace(vNode.props!.to)
                                })
                              }
                            }"
                          >
                            <XLayout
                              variant="x-stack"
                              justify="between"
                            >
                              <span>
                                {{ item.name }}
                              </span>
                              <span>
                                {{ get(globalInsight, item.insightPath)?.total ?? 0 }}
                              </span>
                            </XLayout>
                          </XAction>
                        </li>
                      </ul>
                    </template>
                  </DataCollection>
                </XLayout>
              </DataLoader>
            </XCard>
            <div v-if="route.params.shortName.length > 0">
              <RouterView v-slot="{ Component }">
                <component
                  :is="Component"
                  :resource-types="sourceResources"
                />
              </RouterView>
            </div>
          </XLayout>
        </DataSource>
      </DataSource>
    </AppView>
  </RouteView>
</template>

<script setup lang="ts">
import { get } from '@/app/application'
import { sources as controlPlanesSources } from '@/app/control-planes/sources'
import { sources } from '@/app/resources/sources'
</script>
<style lang="scss" scoped>
.resource-type-collection {
  max-width: 500px;
  align-self: flex-start;

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
