<template>
  <RouteView
    name="mesh-trust-summary-view"
    :params="{
      mesh: '',
      mtrust: '',
      environment: String,
    }"
    v-slot="{ route, t, uri }"
  >
    <DataLoader
      :src="uri(sources, '/meshtrusts/:mtrust', {
        mtrust: route.params.mtrust,
      })"
      v-slot="{ data }"
    >
      <AppView>
        <template #title>
          <h2>{{ data.name }}</h2>
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
            :code="YAML.stringify(data.raw)"
          />
        </template>
        <template v-else>
          <DataLoader
            :src="uri(sources, '/meshtrusts/:mtrust/as/kubernetes', {
              mtrust: route.params.mtrust,
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
    </DataLoader>
  </RouteView>
</template>

<script lang="ts" setup>
import { YAML } from '@/app/application'
import { sources } from '@/app/resources/sources'
</script>
<style scoped>
h2::before {
  --icon-before: url('@/assets/images/policy.svg?inline') !important;
}
</style>
