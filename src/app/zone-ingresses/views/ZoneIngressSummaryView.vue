<template>
  <RouteView
    v-slot="{ route, t }"
    name="zone-ingress-summary-view"
    :params="{
      zone: '',
      zoneIngress: '',
    }"
  >
    <AppView>
      <template #title>
        <h2>
          <RouterLink
            :to="{
              name: 'zone-ingress-detail-view',
              params: {
                zone: route.params.zone,
                zoneIngress: route.params.zoneIngress,
              },
            }"
          >
            <RouteTitle
              :title="t('zone-ingresses.routes.item.title', { name: route.params.zoneIngress })"
            />
          </RouterLink>
        </h2>
      </template>

      <EmptyBlock v-if="props.zoneIngressOverview === undefined">
        {{ t('common.collection.summary.empty_title', { type: 'ZoneIngress' }) }}

        <template #message>
          <p>{{ t('common.collection.summary.empty_message', { type: 'ZoneIngress' }) }}</p>
        </template>
      </EmptyBlock>

      <div
        v-else
        class="stack"
      >
        <div>
          <h3>{{ t('zone-ingresses.routes.item.overview') }}</h3>

          <ZoneIngressSummary
            class="mt-4"
            :zone-ingress-overview="props.zoneIngressOverview"
          />
        </div>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import ZoneIngressSummary from '../components/ZoneIngressSummary.vue'
import type { ZoneIngressOverview } from '../data'
import EmptyBlock from '@/app/common/EmptyBlock.vue'

const props = withDefaults(defineProps<{
  zoneIngressOverview?: ZoneIngressOverview
}>(), {
  zoneIngressOverview: undefined,
})
</script>
<style scoped>
h2 {
  --icon-before: url('@/assets/images/icon-location-on.svg?inline') !important;
}
</style>
