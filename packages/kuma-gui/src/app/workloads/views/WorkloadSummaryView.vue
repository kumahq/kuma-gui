<template>
  <RouteView
    name="workload-summary-view"
    :params="{
      mesh: '',
      wl: '',
      environment: String,
    }"
    v-slot="{ route, t, uri }"
  >
    <DataCollection
      :items="props.items"
      :predicate="item => item.kri === route.params.wl"
    >
      <template #empty>
        <XEmptyState>
          <template #title>
            <h2>
              {{ t('common.collection.summary.empty_title', { type: 'Workload' }) }}
            </h2>
          </template>
          <p>
            {{ t('common.collection.summary.empty_message', { type: 'Workload' }) }}
          </p>
        </XEmptyState>
      </template>
      <template #default="{ items: workloads }">
        <template
          v-for="data in [workloads[0]]"
          :key="typeof data"
        >
          <AppView>
            <template #title>
              <h2
                v-icon-start="'workload'"
              >
                <XAction
                  :to="{
                    name: 'workload-detail-view',
                    params: {
                      mesh: route.params.mesh,
                      wl: route.params.wl,
                    },
                  }"
                >
                  <RouteTitle
                    :title="t('workloads.routes.item.title', { name: data.name })"
                  />
                </XAction>
              </h2>
            </template>
            <XLayout
              type="separated"
              justify="end"
            >
              <div
                v-for="options in [['universal', 'k8s']]"
                :key="typeof options"
              >
                <XSelect
                  :label="t('workloads.routes.item.format')"
                  :selected="route.params.environment"
                  @change="(value) => {
                    route.update({ environment: value })
                  }"
                  @vue:before-mount="$event?.props?.selected && options.includes($event.props.selected) && $event.props.selected !== route.params.environment && route.update({ environment: $event.props.selected })"
                >
                  <template
                    v-for="value in options"
                    :key="value"
                    #[`${value}-option`]
                  >
                    {{ t(`workloads.routes.item.formats.${value}`) }}
                  </template>
                </XSelect>
              </div>
            </XLayout>
            <template v-if="route.params.environment === 'universal'">
              <XCodeBlock
                language="yaml"
                :code="YAML.stringify(data.$raw)"
              />
            </template>
            <template v-else>
              <DataLoader
                :src="uri(sources, '/workloads/:wl/as/kubernetes', {
                  wl: route.params.wl,
                })"
                v-slot="{ data: k8sYaml }"
              >
                <XCodeBlock
                  language="yaml"
                  :code="YAML.stringify(k8sYaml)"
                />
              </DataLoader>
            </template>
          </AppView>
        </template>
      </template>
    </DataCollection>
  </RouteView>
</template>

<script lang="ts" setup>
import { YAML } from '@/app/application'
import type { WorkloadItem } from '@/app/workloads/data'
import { sources } from '@/app/workloads/sources'
const props = defineProps<{
  items: WorkloadItem[]
}>()
</script>
<style scoped>
h2::before {
  --icon-before: url('@/assets/images/linked-services-icon.svg?inline') !important;
}
</style>
