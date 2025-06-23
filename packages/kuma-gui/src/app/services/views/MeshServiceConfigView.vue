<template>
  <RouteView
    name="mesh-service-config-view"
    :params="{
      mesh: '',
      service: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      format: String,
    }"
    v-slot="{ route, t }"
  >
    <AppView>
      <XCard>
        <XLayout>
          <XLayout
            type="separated"
            justify="end"
          >
            <div
              v-for="options in [['universal', 'k8s']]"
              :key="typeof options"
            >
              <XSelect
                :label="t('services.routes.item.format')"
                :selected="route.params.format"
                @change="(value) => {
                  route.update({ format: value })
                }"
                @vue:before-mount="$event?.props?.selected && options.includes($event.props.selected) && $event.props.selected !== route.params.format && route.update({ format: $event.props.selected })"
              >
                <template
                  v-for="value in options"
                  :key="value"
                  #[`${value}-option`]
                >
                  {{ t(`services.routes.item.formats.${value}`) }}
                </template>
              </XSelect>
            </div>
          </XLayout>

          <template v-if="route.params.format === 'universal'">
            <XCodeBlock
              data-testid="codeblock-yaml-universal"
              language="yaml"
              :code="YAML.stringify(props.data.config)"
              :show-k8s-copy-button="false"
              is-searchable
              :query="route.params.codeSearch"
              :is-filter-mode="route.params.codeFilter"
              :is-reg-exp-mode="route.params.codeRegExp"
              @query-change="route.update({ codeSearch: $event })"
              @filter-mode-change="route.update({ codeFilter: $event })"
              @reg-exp-mode-change="route.update({ codeRegExp: $event })"
            />
          </template>

          <template v-else>
            <DataLoader
              :src="`/meshes/${props.data.mesh}/mesh-service/${props.data.id}/as/kubernetes`"
              v-slot="{ data: k8sConfig }"
            >
              <XCodeBlock
                data-testid="codeblock-yaml-k8s"
                language="yaml"
                :code="YAML.stringify(k8sConfig)"
                :show-k8s-copy-button="false"
                is-searchable
                :query="route.params.codeSearch"
                :is-filter-mode="route.params.codeFilter"
                :is-reg-exp-mode="route.params.codeRegExp"
                @query-change="route.update({ codeSearch: $event })"
                @filter-mode-change="route.update({ codeFilter: $event })"
                @reg-exp-mode-change="route.update({ codeRegExp: $event })"
              />
            </DataLoader>
          </template>
        </XLayout>
      </XCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { MeshService } from '../data'
import { YAML } from '@/app/application'
const props = defineProps<{
  data: MeshService
}>()
</script>
