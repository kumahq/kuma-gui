<template>
  <RouteView
    :params="{
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      mesh: '',
      proxyType: '',
      proxy: '',
      connection: '',
      includeEds: false,
      format: String,
      concise: Boolean,
    }"
    :name="props.routeName"
    v-slot="{ t, route, uri }"
  >
    <RouteTitle
      :render="false"
      :title="t('connections.routes.item.navigation.xds')"
    />
    <AppView>
      <DataLoader
        :src="uri(sources, '/connections/xds/for/:proxyType/:name/:mesh/outbound/:outbound/endpoints/:endpoints', {
          name: route.params.proxy,
          outbound: route.params.connection,
          endpoints: String(route.params.includeEds),
          proxyType: ({ ingresses: 'zone-ingress', egresses: 'zone-egress'})[route.params.proxyType] ?? 'dataplane',
          mesh: route.params.mesh || '*',
        })"
        v-slot="{ data, refresh }"
      >
        <template
          v-for="options in [['structured', 'yaml']]"
          :key="typeof options"
        >
          <XSelect
            :label="t('connections.routes.item.format')"
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
              {{ t(`connections.routes.item.formats.${value}`) }}
            </template>
          </XSelect>
        </template>

        <XLayout
          variant="separated"
          justify="end"
        >
          <XCheckbox
            :checked="route.params.concise"
            :label="t('connections.concise')"
            @change="(value) => route.update({ concise: value })"
          />
          <XCheckbox
            :checked="route.params.includeEds"
            :label="t('connections.include_endpoints')"
            @change="(value) => route.update({ includeEds: value })"
          />
          <XAction
            action="refresh"
            appearance="primary"
            @click="refresh"
          >
            {{ t('common.refresh') }}
          </XAction>
        </XLayout>

        <XCodeBlock
          language="yaml"
          is-searchable
          :code="YAML.stringify(route.params.concise ? data.$concise : data.$raw)"
          :query="route.params.codeSearch"
          :is-filter-mode="route.params.codeFilter"
          :is-reg-exp-mode="route.params.codeRegExp"
          @query-change="route.update({ codeSearch: $event })"
          @filter-mode-change="route.update({ codeFilter: $event })"
          @reg-exp-mode-change="route.update({ codeRegExp: $event })"
        />
      </DataLoader>
    </AppView>
  </RouteView>
</template>
<script lang="ts" setup>
import AccordionList from '@/app/common/AccordionList.vue';
import { sources } from '../sources'
import AccordionItem from '@/app/common/AccordionItem.vue';
import { YAML } from '@/app/application';
const props = defineProps<{
  routeName: string
}>()
</script>
