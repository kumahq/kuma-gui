<template>
  <div class="zones">
    <MultizoneInfo v-if="store.getters['config/getMulticlusterStatus'] === false" />

    <div
      v-else
      class="kcard-stack"
    >
      <div class="kcard-border">
        <DataOverview
          :selected-entity-name="entity?.name"
          :page-size="PAGE_SIZE_DEFAULT"
          :is-loading="isLoading"
          :error="error"
          :empty-state="EMPTY_STATE"
          :table-data="tableData"
          :table-data-is-empty="tableDataIsEmpty"
          :show-warnings="tableData.data.some((item) => item.withWarnings)"
          :next="nextUrl"
          :page-offset="pageOffset"
          @table-action="getEntity"
          @load-data="loadData"
        >
          <template #additionalControls>
            <KButton
              v-if="$route.query.ns"
              class="back-button"
              appearance="primary"
              icon="arrowLeft"
              :to="{ name: 'zone-list-view' }"
            >
              View all
            </KButton>
          </template>
        </DataOverview>
      </div>

      <div
        v-if="entity !== null"
        class="kcard-border"
      >
        <ZoneDetails :zone-overview="entity" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { KButton } from '@kong/kongponents'
import { onBeforeMount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import MultizoneInfo from '../components/MultizoneInfo.vue'
import ZoneDetails from '../components/ZoneDetails.vue'
import DataOverview from '@/app/common/DataOverview.vue'
import { PAGE_SIZE_DEFAULT } from '@/constants'
import { useStore } from '@/store/store'
import { TableHeader, ZoneOverview } from '@/types/index.d'
import { useKumaApi } from '@/utilities'
import { getItemStatusFromInsight } from '@/utilities/dataplane'
import { fetchAllResources } from '@/utilities/helpers'
import { QueryParameter } from '@/utilities/QueryParameter'

const kumaApi = useKumaApi()

const EMPTY_STATE = {
  title: 'No Data',
  message: 'There are no Zones present.',
}

const route = useRoute()
const store = useStore()

const props = defineProps({
  selectedZoneName: {
    type: String,
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
const isEmpty = ref(false)
const error = ref<Error | null>(null)
const entityIsLoading = ref(true)
const entityIsEmpty = ref(false)
const entityHasError = ref(false)
const tableDataIsEmpty = ref(false)
const tableData = ref<{ headers: TableHeader[], data: any[] }>({
  headers: [
    { label: 'Status', key: 'status' },
    { label: 'Name', key: 'name' },
    { label: 'Zone CP Version', key: 'zoneCpVersion' },
    { label: 'Storage type', key: 'storeType' },
    { label: 'Ingress', key: 'hasIngress' },
    { label: 'Egress', key: 'hasEgress' },
    { label: 'Warnings', key: 'warnings', hideLabel: true },
  ],
  data: [],
})
const entity = ref<ZoneOverview | null>(null)
const nextUrl = ref<string | null>(null)
const pageOffset = ref(props.offset)
const zonesWithIngress = ref(new Set())
const zonesWithEgress = ref(new Set())

watch(() => route.params.mesh, function () {
  // Don’t trigger a load when the user is navigating to another route.
  if (route.name !== 'zone-list-view') {
    return
  }

  // Ensures basic state is reset when switching meshes using the mesh selector.
  isLoading.value = true
  isEmpty.value = false
  entityIsLoading.value = true
  entityIsEmpty.value = false
  entityHasError.value = false
  tableDataIsEmpty.value = false
  error.value = null

  init(0)
})

onBeforeMount(function () {
  init(props.offset)
})

function init(offset: number): void {
  if (store.getters['config/getMulticlusterStatus']) {
    loadData(offset)
  }
}

function parseData(zoneOverview: ZoneOverview): any {
  let zoneCpVersion = '-'
  let storeType = ''
  let cpCompat = true

  const subscriptions = zoneOverview.zoneInsight?.subscriptions ?? []

  subscriptions.forEach((item: any) => {
    if (item.version && item.version.kumaCp) {
      zoneCpVersion = item.version.kumaCp.version
      const { kumaCpGlobalCompatible = true } = item.version.kumaCp

      cpCompat = kumaCpGlobalCompatible
      if (item.config) {
        storeType = JSON.parse(item.config).store.type
      }
    }
  })

  const status = getItemStatusFromInsight(zoneOverview.zoneInsight)

  return {
    ...zoneOverview,
    status,
    zoneCpVersion,
    storeType,
    hasIngress: zonesWithIngress.value.has(zoneOverview.name) ? 'Yes' : 'No',
    hasEgress: zonesWithEgress.value.has(zoneOverview.name) ? 'Yes' : 'No',
    withWarnings: !cpCompat,
  }
}

function calculateZonesWithIngress(zoneIngresses: any[]): void {
  const zones = new Set()

  zoneIngresses.forEach(({ zoneIngress: { zone } }) => {
    zones.add(zone)
  })

  zonesWithIngress.value = zones
}

function calculateZonesWithEgress(zoneEgresses: any[]): void {
  const zones = new Set()

  zoneEgresses.forEach(({ zoneEgress: { zone } }) => {
    zones.add(zone)
  })

  zonesWithEgress.value = zones
}

async function loadData(offset: number): Promise<void> {
  pageOffset.value = offset
  // Puts the offset parameter in the URL so it can be retrieved when the user reloads the page.
  QueryParameter.set('offset', offset > 0 ? offset : null)

  isLoading.value = true
  isEmpty.value = false

  const name = route.query.ns as string || null
  const size = PAGE_SIZE_DEFAULT

  try {
    const [{ data, next }, { items: zoneIngresses }, { items: zoneEgresses }] = await Promise.all([
      getZoneOverviews(name, size, offset),
      fetchAllResources(kumaApi.getAllZoneIngressOverviews.bind(kumaApi)),
      fetchAllResources(kumaApi.getAllZoneEgressOverviews.bind(kumaApi)),
    ])

    // set pagination
    nextUrl.value = next

    // set table data
    if (data.length) {
      calculateZonesWithIngress(zoneIngresses)
      calculateZonesWithEgress(zoneEgresses)
      tableData.value.data = data.map(parseData)
      tableDataIsEmpty.value = false
      isEmpty.value = false

      await getEntity({ name: props.selectedZoneName ?? data[0].name })
    } else {
      tableData.value.data = []
      tableDataIsEmpty.value = true
      isEmpty.value = true
      entityIsEmpty.value = true
    }
  } catch (err) {
    if (err instanceof Error) {
      error.value = err
    } else {
      console.error(err)
    }

    isEmpty.value = true
  } finally {
    isLoading.value = false
  }
}

async function getEntity({ name }: { name: string }): Promise<void> {
  entityHasError.value = false
  entityIsLoading.value = true
  entityIsEmpty.value = false

  try {
    // get the Zone details from the Zone Insights endpoint
    entity.value = await kumaApi.getZoneOverview({ name })
    QueryParameter.set('zone', name)
  } catch (err) {
    console.error(err)

    entity.value = null
    entityHasError.value = true
    entityIsEmpty.value = true
  } finally {
    entityIsLoading.value = false
  }
}

async function getZoneOverviews(name: string | null, size: number, offset: number): Promise<{ data: ZoneOverview[], next: string | null }> {
  if (name) {
    const zoneOverview = await kumaApi.getZoneOverview({ name }, { size, offset })

    return {
      data: [zoneOverview],
      next: null,
    }
  } else {
    const { items, next } = await kumaApi.getAllZoneOverviews({ size, offset })

    return {
      data: items ?? [],
      next,
    }
  }
}
</script>
