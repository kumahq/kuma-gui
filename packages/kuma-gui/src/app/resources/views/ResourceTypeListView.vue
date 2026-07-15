<template>
  <RouteView
    name="resource-type-list-view"
    :params="{
      mesh: '',
      shortName: '',
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
        :src="uri(sources, '/resource-type-descriptors', {})"
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
              <XCard class="resource-type-collection">
                <template #actions>
                  <XLayout
                    variant="separated"
                    size="large"
                  >
                    <template
                      v-for="options in [[
                        'all',
                        'resilience',
                        'traffic',
                        'security',
                        'observability',
                        'testing',
                        'advanced',
                      ]]"
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
                  :data="[sourceResources]"
                  :errors="[resourcesError]"
                  v-slot="{ data: [resources] }"
                >
                  <template
                    v-for="legacy in [typeof sourceMeshInsight?.resources === 'undefined' ? [] : resources.resources.filter(item => {
                      // legacy policies are those that aren't targetRef _and are also in use_ i.e. have a count
                      // explictly check for false not falsey
                      return item.policy?.isTargetRef === false && (sourceMeshInsight.resources[item.name]?.total ?? 0) > 0
                    })]"
                    :key="typeof legacy"
                  >
                    <DataCollection
                      :items="resources.resources"
                      :predicate="item =>
                        // if we have _any legacy and in-use_ policies then show anything/everything
                        // otherwise
                        // if its not a policy, or its a targetRef policy, i.e. we ignore legacies
                        (legacy.length > 0 || (typeof item.policy === 'undefined' || item.policy?.isTargetRef))
                        && (route.params.category === 'all' || item.categories.includes(route.params.category))"
                      v-slot="{ items: filtered }"
                    >
                      <XLayout
                        variant="y-stack"
                      >
                        <template
                          v-for="([key, group], i) in Object.entries(Object.groupBy(filtered, (resource) => resource.group)).toSorted((a, b) => a[0] > b[0] ? -1 : 1)"
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
                                  v-slot="{ items }"
                                >
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
                                          name: 'resource-list-view',
                                          params: {
                                            mesh: route.params.mesh,
                                            shortName: item.shortName,
                                          },
                                          query: {
                                            category: route.params.category,
                                          },
                                        }"
                                        :data-testid="`resource-type-link-${item.name}`"
                                        @vue:mounted="(vNode) => {
                                          if((route.params.shortName.length === 0 || !resources.resources.find((resource) => resource.shortName === route.params.shortName)) && i === 0 && j === 0 && vNode.props?.to) {
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
                                          <span v-if="item.group === 'global'">
                                            <DataLoader
                                              variant="count"
                                              :data="[sourceGlobalInsight]"
                                              :errors="[globalInsightError]"
                                            >
                                              <template #default="{ data: [globalInsight] }">
                                                {{ globalInsight.resources[item.name]?.total ?? 0 }}
                                              </template>
                                              <template #error>
                                                &nbsp;
                                              </template>
                                            </DataLoader>
                                          </span>
                                          <span v-else>
                                            <DataLoader
                                              variant="count"
                                              :data="[sourceMeshInsight]"
                                              :errors="[meshInsightError]"
                                            >
                                              <template #default="{ data: [meshInsight] }">
                                                {{ meshInsight.resources[item.name]?.total ?? 0 }}
                                              </template>
                                              <template #error>
                                                &nbsp;
                                              </template>
                                            </DataLoader>
                                          </span>
                                        </XLayout>
                                      </XAction>
                                    </li>
                                  </ul>
                                </DataCollection>
                              </XLayout>
                            </li>
                          </ul>
                        </template>
                      </XLayout>
                    </DataCollection>
                  </template>
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
