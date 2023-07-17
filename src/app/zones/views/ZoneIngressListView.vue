<template>
  <RouteView>
    <RouteTitle
      :title="t('zone-ingresses.routes.items.title')"
    />
    <AppView
      :breadcrumbs="[
        {
          to: {
            name: 'zone-ingress-list-view',
          },
          text: t('zone-ingresses.routes.items.breadcrumbs')
        },
      ]"
    >
      <div class="zoneingresses">
        <MultizoneInfo v-if="store.getters['config/getMulticlusterStatus'] === false" />

        <!-- Zone CPs information for when Multicluster is enabled -->
        <div
          v-else
          class="stack"
        >
          <div class="kcard-border">
            <DataOverview
              :selected-entity-name="entity?.name"
              :page-size="PAGE_SIZE_DEFAULT"
              :is-loading="isLoading"
              :error="error"
              :empty-state="EMPTY_STATE"
              :table-data="tableData"
              :table-data-is-empty="tableData.data.length === 0"
              :next="nextUrl"
              :page-offset="pageOffset"
              @table-action="loadEntity"
              @load-data="loadData"
            />
          </div>

          <div
            v-if="entity !== null"
            class="kcard-border"
            data-testid="list-view-summary"
          >
            <ZoneIngressDetails :zone-ingress-overview="entity" />
          </div>
        </div>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { PropType, ref, watch } from 'vue'
import { RouteLocationNamedRaw } from 'vue-router'

import MultizoneInfo from '../components/MultizoneInfo.vue'
import ZoneIngressDetails from '../components/ZoneIngressDetails.vue'
import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import DataOverview from '@/app/common/DataOverview.vue'
import { PAGE_SIZE_DEFAULT } from '@/constants'
import { useStore } from '@/store/store'
import { StatusKeyword, TableHeader, ZoneIngressOverview } from '@/types/index.d'
import { useKumaApi, useI18n } from '@/utilities'
import { getItemStatusFromInsight } from '@/utilities/dataplane'
import { QueryParameter } from '@/utilities/QueryParameter'

type ZoneIngressOverviewTableRow = {
  entity: ZoneIngressOverview
  detailViewRoute: RouteLocationNamedRaw
  status: StatusKeyword
}

const kumaApi = useKumaApi()
const { t } = useI18n()

const EMPTY_STATE = {
  title: 'No Data',
  message: 'There are no Zone Ingresses present.',
}

const store = useStore()

const props = defineProps({
  selectedZoneIngressName: {
    type: [String, null] as PropType<string | null>,
    required: false,
    default: null,
  },

  offset: {
    type: Number,
    required: false,
    default: 0,
  },
})

const isLoading = ref(true)
const error = ref<Error | null>(null)
const tableData = ref<{ headers: TableHeader[], data: ZoneIngressOverviewTableRow[] }>({
  headers: [
    { label: 'Status', key: 'status' },
    { label: 'Name', key: 'entity' },
  ],
  data: [],
})
const entity = ref<ZoneIngressOverview | null>(null)
const nextUrl = ref<string | null>(null)
const pageOffset = ref(props.offset)

watch(() => store.getters['config/getMulticlusterStatus'], function (isMultizoneMode) {
  if (isMultizoneMode) {
    loadData(props.offset)
  }
}, { immediate: true })

async function loadData(offset: number) {
  pageOffset.value = offset
  // Puts the offset parameter in the URL so it can be retrieved when the user reloads the page.
  QueryParameter.set('offset', offset > 0 ? offset : null)

  isLoading.value = true
  error.value = null

  const size = PAGE_SIZE_DEFAULT

  try {
    const { items, next } = await kumaApi.getAllZoneIngressOverviews({ size, offset })

    nextUrl.value = next
    tableData.value.data = transformToTableData(items ?? [])
    await loadEntity({ name: props.selectedZoneIngressName ?? tableData.value.data[0]?.entity.name })
  } catch (err) {
    tableData.value.data = []
    entity.value = null

    if (err instanceof Error) {
      error.value = err
    } else {
      console.error(err)
    }
  } finally {
    isLoading.value = false
  }
}

function transformToTableData(zoneIngressOverviews: ZoneIngressOverview[]): ZoneIngressOverviewTableRow[] {
  return zoneIngressOverviews.map((entity) => {
    const { name } = entity
    const detailViewRoute: RouteLocationNamedRaw = {
      name: 'zone-ingress-detail-view',
      params: {
        zoneIngress: name,
      },
    }
    const status = getItemStatusFromInsight(entity.zoneIngressInsight ?? {})

    return {
      entity,
      detailViewRoute,
      status,
    }
  })
}

async function loadEntity({ name }: { name?: string | undefined }) {
  if (name === undefined) {
    entity.value = null
    QueryParameter.set('zoneIngress', null)
    return
  }

  try {
    entity.value = await kumaApi.getZoneIngressOverview({ name })
    QueryParameter.set('zoneIngress', name)
  } catch (err) {
    console.error(err)
  }
}
</script>
