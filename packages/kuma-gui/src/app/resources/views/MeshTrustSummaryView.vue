<template>
  <RouteView
    name="mesh-identity-summary-view"
    :params="{
      mesh: '',
      name: '',
      environment: String,
    }"
    v-slot="{ route, t, uri }"
  >
    <DataCollection
      :items="props.meshTrusts"
      :predicate="item => item.name.toLocaleLowerCase() === route.params.name"
      v-slot="{ items }"
    >
      <AppView>
        <template #title>
          <h2>{{ items[0].name }}</h2>
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
            :code="YAML.stringify(items[0])"
          />
        </template>
        <template v-else>
          <DataLoader
            :src="uri(sources, '/meshes/:mesh/meshtrusts/:name/as/kubernetes', {
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
      </AppView>
    </DataCollection>
  </RouteView>
</template>

<script lang="ts" setup>
import type { MeshTrust } from '../data/MeshTrust'
import { YAML } from '@/app/application'
import { sources } from '@/app/resources/sources'

const props = defineProps<{
  meshTrusts: MeshTrust[]
}>()
</script>
<style scoped>
h2::before {
  --icon-before: url('@/assets/images/policy.svg?inline') !important;
}
</style>
