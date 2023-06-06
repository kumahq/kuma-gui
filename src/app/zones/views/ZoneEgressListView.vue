<template>
  <div class="zoneegresses">
    <div class="kcard-stack">
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
      >
        <ZoneEgressDetails :zone-egress-overview="entity" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType, ref, watch } from 'vue'
import { RouteLocationNamedRaw, useRoute } from 'vue-router'

import ZoneEgressDetails from '../components/ZoneEgressDetails.vue'
import DataOverview from '@/app/common/DataOverview.vue'
import { PAGE_SIZE_DEFAULT } from '@/constants'
import { StatusKeyword, TableHeader, ZoneEgressOverview } from '@/types/index.d'
import { useKumaApi } from '@/utilities'
import { getItemStatusFromInsight } from '@/utilities/dataplane'
import { QueryParameter } from '@/utilities/QueryParameter'

type ZoneEgressOverviewTableRow = {
  entity: ZoneEgressOverview
  detailViewRoute: RouteLocationNamedRaw
  status: StatusKeyword
}

const kumaApi = useKumaApi()

const EMPTY_STATE = {
  title: 'No Data',
  message: 'There are no Zone Egresses present.',
}

const route = useRoute()

const props = defineProps({
  selectedZoneEgressName: {
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
const tableData = ref<{ headers: TableHeader[], data: ZoneEgressOverviewTableRow[] }>({
  headers: [
    { label: 'Status', key: 'status' },
    { label: 'Name', key: 'entity' },
  ],
  data: [],
})
const entity = ref<ZoneEgressOverview | null>(null)
const nextUrl = ref<string | null>(null)
const pageOffset = ref(props.offset)

watch(() => route.params.mesh, function () {
  // Don’t trigger a load when the user is navigating to another route.
  if (route.name !== 'zone-egress-list-view') {
    return
  }

  loadData(0)
})

loadData(props.offset)

async function loadData(offset: number) {
  pageOffset.value = offset
  // Puts the offset parameter in the URL so it can be retrieved when the user reloads the page.
  QueryParameter.set('offset', offset > 0 ? offset : null)

  isLoading.value = true
  error.value = null

  const size = PAGE_SIZE_DEFAULT

  try {
    const { items, next } = await kumaApi.getAllZoneEgressOverviews({ size, offset })

    nextUrl.value = next
    tableData.value.data = transformToTableData(items ?? [])
    await loadEntity({ name: props.selectedZoneEgressName ?? tableData.value.data[0]?.entity.name })
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

function transformToTableData(zoneEgressOverviews: ZoneEgressOverview[]): ZoneEgressOverviewTableRow[] {
  return zoneEgressOverviews.map((entity) => {
    const { name } = entity
    const detailViewRoute: RouteLocationNamedRaw = {
      name: 'zone-egress-detail-view',
      params: {
        zoneEgress: name,
      },
    }
    const status = getItemStatusFromInsight(entity.zoneEgressInsight ?? {})

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
    QueryParameter.set('zoneEgress', null)
    return
  }

  try {
    entity.value = await kumaApi.getZoneEgressOverview({ name })
    QueryParameter.set('zoneEgress', name)
  } catch (err) {
    console.error(err)
  }
}
</script>
