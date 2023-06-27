<template>
  <RouteView
    v-slot="{route: _route}"
  >
    <RouteTitle
      :title="t('zone-egresses.routes.item.title', {name: _route.params.zoneEgress})"
    />
    <AppView
      :breadcrumbs="[
        {
          to: {
            name: 'zone-egress-list-view',
          },
          text: t('zone-egresses.routes.item.breadcrumbs')
        },
      ]"
    >
      <div class="zone-details">
        <LoadingBlock v-if="isLoading" />

        <ErrorBlock
          v-else-if="error !== null"
          :error="error"
        />

        <EmptyBlock v-else-if="zoneEgressOverview === null" />

        <div
          v-else
          class="kcard-border"
          data-testid="detail-view-details"
        >
          <ZoneEgressDetails :zone-egress-overview="zoneEgressOverview" />
        </div>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import ZoneEgressDetails from '../components/ZoneEgressDetails.vue'
import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import type { ZoneEgressOverview } from '@/types/index.d'
import { useKumaApi, useI18n } from '@/utilities'

const kumaApi = useKumaApi()
const route = useRoute()
const { t } = useI18n()

const zoneEgressOverview = ref<ZoneEgressOverview | null>(null)
const isLoading = ref(true)
const error = ref<Error | null>(null)

start()

function start() {
  loadData()
}

async function loadData() {
  isLoading.value = true
  error.value = null

  const name = route.params.zoneEgress as string

  try {
    zoneEgressOverview.value = await kumaApi.getZoneEgressOverview({ name })
  } catch (err) {
    zoneEgressOverview.value = null

    if (err instanceof Error) {
      error.value = err
    } else {
      console.error(err)
    }
  } finally {
    isLoading.value = false
  }
}
</script>
