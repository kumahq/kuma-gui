<template>
  <RouteView
    v-slot="{ route: _route }"
  >
    <RouteTitle
      :title="t('zone-ingresses.routes.item.title', {name: _route.params.zoneIngress})"
    />
    <AppView
      :breadcrumbs="[
        {
          to: {
            name: 'zone-ingress-list-view',
          },
          text: t('zone-ingresses.routes.item.breadcrumbs')
        },
      ]"
    >
      <div class="zone-details">
        <LoadingBlock v-if="isLoading" />

        <ErrorBlock
          v-else-if="error !== null"
          :error="error"
        />

        <EmptyBlock v-else-if="zoneIngressOverview === null" />

        <div
          v-else
          class="kcard-border"
          data-testid="detail-view-details"
        >
          <ZoneIngressDetails :zone-ingress-overview="zoneIngressOverview" />
        </div>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import ZoneIngressDetails from '../components/ZoneIngressDetails.vue'
import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import type { ZoneIngressOverview } from '@/types/index.d'
import { useKumaApi, useI18n } from '@/utilities'

const kumaApi = useKumaApi()
const route = useRoute()
const { t } = useI18n()

const zoneIngressOverview = ref<ZoneIngressOverview | null>(null)
const isLoading = ref(true)
const error = ref<Error | null>(null)

start()

function start() {
  loadData()
}

async function loadData() {
  isLoading.value = true
  error.value = null

  const name = route.params.zoneIngress as string

  try {
    zoneIngressOverview.value = await kumaApi.getZoneIngressOverview({ name })
  } catch (err) {
    zoneIngressOverview.value = null

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
