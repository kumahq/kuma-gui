<template>
  <RouteView
    :name="props.routeName"
    :params="{
      mesh: '',
      name: '',
      environment: String,
    }"
    v-slot="{ route, t, uri }"
  >
    <AppView>
      <template #title>
        <h2>{{ route.params.name }}</h2>
      </template>
      <DataLoader
        :src="uri(sources, '/meshes/:mesh/meshidentities/:name', {
          mesh: route.params.mesh,
          name: route.params.name,
        })"
        v-slot="{ data }"
      >
        <XLayout
          type="separated"
          justify="end"
        >
          <div
            v-for="options in [['universal', 'k8s']]"
            :key="typeof options"
          >
            <XSelect
              :label="t('gateways.routes.item.format')"
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
                {{ t(`gateways.routes.item.formats.${value}`) }}
              </template>
            </XSelect>
          </div>
        </XLayout>
        <template v-if="route.params.environment === 'universal'">
          <XCodeBlock
            language="yaml"
            :code="YAML.stringify(data)"
          />
        </template>
        <template v-else>
          <DataLoader
            :src="uri(sources, '/meshes/:mesh/meshidentities/:name/as/kubernetes', {
              mesh: route.params.mesh,
              name: route.params.name,
            })"
            v-slot="{ data: k8sYaml }"
          >
            <XCodeBlock
              language="yaml"
              :code="YAML.stringify(k8sYaml)"
            />
          </DataLoader>
        </template>
      </DataLoader>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { MeshIdentity } from '../data/MeshIdentity'
import { YAML } from '@/app/application'
import { sources } from '@/app/resources/sources'

const props = defineProps<{
  meshIdentities: MeshIdentity[]
  routeName: string
}>()
</script>
<style scoped>
h2::before {
  --icon-before: url('@/assets/images/policy.svg?inline') !important;
}
</style>
