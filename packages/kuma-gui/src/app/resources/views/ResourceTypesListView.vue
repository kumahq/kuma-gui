<template>
  <RouteView
    name="resource-types-list-view"
    :params="{
      mesh: '',
      resourcePath: '',
      category: String,
    }"
    v-slot="{ uri, route, t }"
  >
    <RouteTitle
      :render="false"
      :title="t('resources.routes.items.title')"
    />
    <AppView>
      <DataSource
        :src="uri(sources, '/resources/of/:category', {
          category: route.params.category || 'all',
        })"
        v-slot="{ data: sourceResources, error: resourcesError }"
      >
        <DataSource
          :src="uri(controlPlanesSources, '/global-insight', {})"
          v-slot="{ data: sourceGlobalInsight, error: globalInsightError }"
        >
          <DataSource
            :src="uri(meshesSources, '/mesh-insights/:name', { name: route.params.mesh })"
            v-slot="{ data: sourceMeshInsight, error: meshInsightError }"
          >
            <XLayout
              variant="x-stack"
              size="large"
            >
              <XCard class="resource-types-collection">
                <template #actions>
                  <XLayout
                    variant="separated"
                    size="large"
                  >
                    <template
                      v-for="options in [['all', 'security', 'traffic', 'observability', 'performance', 'reliability']]"
                      :key="typeof options"
                    >
                      <XSelect
                        :label="t('resources.routes.items.category.title')"
                        :selected="route.params.category"
                        @change="(value) => route.update({ category: value })"
                        @vue:before-mount="$event?.props?.selected && options.includes($event.props.selected) && $event.props.selected !== route.params.category ? route.update({ category: $event.props.selected }) : route.update({ category: 'all' })"
                      >
                        <template
                          v-for="option in options"
                          :key="option.value"
                          #[`${option}-option`]
                        >
                          {{ t(`resources.routes.items.category.options.${option}`) }}
                        </template>
                      </XSelect>
                    </template>
                  </XLayout>
                </template>
                <DataLoader
                  :data="[sourceResources, sourceGlobalInsight, sourceMeshInsight]"
                  :errors="[resourcesError, globalInsightError, meshInsightError]"
                  v-slot="{ data: [resources, globalInsight, meshInsight] }"
                >
                  <XLayout
                    v-for="filtered in [resources.resources.filter((item) => !item.name.toLowerCase().includes('insight') && !item.name.toLocaleLowerCase().includes('secret') && (!item.policy || !(item.policy?.isTargetRef === false && (meshInsight.policies[item.name]?.total ?? 0) === 0)) && (item.name !== 'ExternalService' || meshInsight.services.external > 0))]"
                    :key="typeof filtered"
                    variant="y-stack"
                  >
                    <template
                      v-for="([key, group], i) in Object.entries(Object.groupBy(filtered, (resource) => resource.scope)).toSorted((a, b) => a[0] > b[0] ? -1 : 1)"
                      :key="key"
                    >
                      <ul v-if="group?.length">
                        <li>
                          <XLayout
                            variant="y-stack"
                          >
                            <header>
                              <h3>{{ t(`resources.routes.items.types.${key}.title`) }}</h3>
                            </header>
                            <DataCollection
                              :items="group"
                            >
                              <template #default="{ items }">
                                <ul>
                                  <li
                                    v-for="(item, j) in items"
                                    :key="item.name"
                                  >
                                    <XAction
                                      :to="{
                                        name: 'resource-list-view',
                                        params: {
                                          mesh: route.params.mesh,
                                          resourcePath: item.path,
                                        },
                                      }"
                                      :data-testid="`resource-type-link-${item.name}`"
                                      @vue:mounted="(vNode) => {
                                        if((route.params.resourcePath.length === 0 || !resources.resources.find((resource) => resource.path === route.params.resourcePath)) && i === 0 && j === 0 && vNode.props?.to) {
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
                                        <span v-if="item.scope === 'global'">
                                          {{ globalInsight.resources[item.name]?.total ?? 0 }}
                                        </span>
                                        <span v-else>
                                          {{ meshInsight.resources[item.name]?.total ?? 0 }}
                                        </span>
                                      </XLayout>
                                    </XAction>
                                  </li>
                                </ul>
                              </template>
                            </DataCollection>
                          </XLayout>
                        </li>
                      </ul>
                    </template>
                  </XLayout>
                </DataLoader>
              </XCard>
              <div v-if="route.params.resourcePath.length > 0">
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
      </DataSource>
    </AppView>
  </RouteView>
</template>

<script setup lang="ts">
import { sources as controlPlanesSources } from '@/app/control-planes/sources'
import { sources as meshesSources } from '@/app/meshes/sources'
import { sources } from '@/app/resources/sources'
</script>
<style lang="scss" scoped>
.resource-types-collection {
  flex-grow: 1;
  overflow-y: auto;
  min-height: 0;
  min-width: 500px;
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
