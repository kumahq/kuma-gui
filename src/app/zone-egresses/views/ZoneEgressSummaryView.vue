<template>
  <RouteView
    v-slot="{ route, t }"
    name="zone-egress-summary-view"
    :params="{
      zone: '',
      zoneEgress: '',
    }"
  >
    <AppView>
      <template #title>
        <h2>
          <RouterLink
            :to="{
              name: 'zone-egress-detail-view',
              params: {
                zone: route.params.zone,
                zoneEgress: route.params.zoneEgress,
              },
            }"
          >
            <RouteTitle
              :title="t('zone-egresses.routes.item.title', { name: route.params.zoneEgress })"
            />
          </RouterLink>
        </h2>
      </template>

      <EmptyBlock v-if="props.zoneEgressOverview === undefined">
        <template #title>
          {{ t('common.collection.summary.empty_title', { type: 'ZoneEgress' }) }}
        </template>

        <p>{{ t('common.collection.summary.empty_message', { type: 'ZoneEgress' }) }}</p>
      </EmptyBlock>

      <div
        v-else
        class="stack"
      >
        <div>
          <h3>{{ t('zone-egresses.routes.item.overview') }}</h3>

          <ZoneEgressSummary
            class="mt-4"
            :zone-egress-overview="props.zoneEgressOverview"
          />
        </div>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import ZoneEgressSummary from '../components/ZoneEgressSummary.vue'
import type { ZoneEgressOverview } from '../data'
import EmptyBlock from '@/app/common/EmptyBlock.vue'

const props = withDefaults(defineProps<{
  zoneEgressOverview?: ZoneEgressOverview
}>(), {
  zoneEgressOverview: undefined,
})
</script>
<style scoped>
h2 {
  --icon-before: url('@/assets/images/icon-location-on.svg?inline') !important;
}
</style>
