<template>
  <RouteView
    v-slot="{ can, route }"
    name="zone-cp-detail-tabs-view"
    :params="{
      zone: '',
    }"
  >
    <DataSource
      v-slot="{ data, error }: ZoneOverviewSource"
      :src="`/zone-cps/${route.params.zone}`"
      @change="change"
    >
      <ErrorBlock
        v-if="error !== undefined"
        :error="error"
      />

      <LoadingBlock v-else-if="data === undefined" />

      <template v-else>
        <AppView
          :breadcrumbs="[
            {
              to: {
                name: 'zone-cp-list-view',
              },
              text: t('zone-cps.routes.item.breadcrumbs'),
            },
          ]"
        >
          <template #title>
            <h1>
              <TextWithCopyButton :text="route.params.zone">
                <RouteTitle
                  :title="t('zone-cps.routes.item.title', { name: route.params.zone })"
                />
              </TextWithCopyButton>
            </h1>
          </template>

          <template
            v-if="can('create zones')"
            #actions
          >
            <ZoneActionMenu :zone-overview="data" />
          </template>

          <NavTabs
            :children="route.children"
            :active="route.active"
            i18n-prefix="zone-cps.routes.item.navigation"
          />

          <RouterView v-slot="child">
            <component
              :is="child.Component"
              :data="data"
              :notifications="notifications"
            />
          </RouterView>
        </AppView>
      </template>
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import ZoneActionMenu from '../components/ZoneActionMenu.vue'
import type { ZoneOverview } from '../data'
import type { ZoneOverviewSource } from '../sources'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import NavTabs from '@/app/common/NavTabs.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import { useI18n } from '@/utilities'
import { get } from '@/utilities/get'

const { t } = useI18n()

const notifications = ref<{kind: string, payload: Record<string, string>}[]>([])

const change = (data: ZoneOverview) => {
  const warnings = []
  if (data.zoneInsight.store === 'memory') {
    warnings.push({
      kind: 'ZONE_STORE_TYPE_MEMORY',
      payload: {},
    })
  }
  if (!get(data.zoneInsight, 'version.kumaCp.kumaCpGlobalCompatible', 'true')) {
    warnings.push({
      kind: 'INCOMPATIBLE_ZONE_AND_GLOBAL_CPS_VERSIONS',
      payload: {
        zoneCpVersion: get(data.zoneInsight, 'version.kumaCp.version', t('common.collection.none')),
      },
    })
  }
  notifications.value = warnings
}

</script>
