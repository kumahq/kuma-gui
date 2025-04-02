<template>
  <div
    v-bind="$attrs"
  >
    <DataCollection
      :items="props.items ?? [undefined]"
      :type="can('create zones') ? `zones-crud` : `zone-cps`"
    >
      <AppCollection
        :headers="[
          { ...storage.get('zone.headers.type'), label: '&nbsp;', key: 'type' },
          { ...storage.get('zone.headers.name'),label: t('zone-cps.components.zone-control-planes-list.name'), key: 'name'},
          { ...storage.get('zone.headers.status'),label: t('zone-cps.components.zone-control-planes-list.status'), key: 'status'},
        ]"
        :items="props.items"
        @resize="(obj) => {
          storage.set({
            zone: obj,
          })
        }"
      >
        <template
          #type="{ row: item }"
        >
          <template
            v-for="env in [(['kubernetes', 'universal'] as const).find(env => env === item.zoneInsight.environment) ?? 'kubernetes']"
            :key="env"
          >
            <XIcon
              :name="env"
            >
              {{ t(`common.product.environment.${env}`) }}
            </XIcon>
          </template>
        </template>
        <template
          #name="{ row: item }"
        >
          <XAction
            data-action
            :to="{
              name: 'zone-cp-detail-view',
              params: {
                zone: item.name,
              },
            }"
          >
            {{ item.name }}
          </XAction>
        </template>

        <template
          #status="{ row: item }"
        >
          <StatusBadge
            :status="item.state"
          />
        </template>
      </AppCollection>
    </DataCollection>
  </div>
</template>

<script lang="ts" setup>
import type { ZoneOverview } from '../data'
import { useCan, useI18n } from '@/app/application'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'

const { t } = useI18n()
const can = useCan()

const props = withDefaults(defineProps<{
  items?: ZoneOverview[]
  storage?: {
    get: (uri: string) => {}
    set: (data: any) => void
  }
}>(), {
  items: undefined,
  storage: () => ({
    get: () => ({}),
    set: () => {},
  }),
})
</script>
<style lang="scss" scoped>
.app-collection:deep(:is(th, td):nth-child(1)) {
  padding-left: 8px !important;
  padding-right: 0 !important;
  width: 16px !important;
}
.app-collection :deep(td:nth-child(2) a) {
  color: inherit;
  font-weight: $kui-font-weight-semibold;
  text-decoration: none;
}
</style>
