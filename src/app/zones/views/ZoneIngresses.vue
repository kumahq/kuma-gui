<template>
  <div class="zoneingresses">
    <MultizoneInfo v-if="store.getters['config/getMulticlusterStatus'] === false" />

    <!-- Zone CPs information for when Multicluster is enabled -->
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
          :table-data-is-empty="isEmpty"
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
              :to="{ name: 'zone-ingress-list-view' }"
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
        <ZoneIngressDetails :zone-ingress-overview="entity" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { KButton } from '@kong/kongponents'
import { onBeforeMount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import MultizoneInfo from '../components/MultizoneInfo.vue'
import ZoneIngressDetails from '../components/ZoneIngressDetails.vue'
import DataOverview from '@/app/common/DataOverview.vue'
import { PAGE_SIZE_DEFAULT } from '@/constants'
import { useStore } from '@/store/store'
import { TableHeader, ZoneIngressOverview } from '@/types/index.d'
import { useKumaApi } from '@/utilities'
import { getItemStatusFromInsight } from '@/utilities/dataplane'
import { QueryParameter } from '@/utilities/QueryParameter'

const kumaApi = useKumaApi()

const EMPTY_STATE = {
  title: 'No Data',
  message: 'There are no Zone Ingresses present.',
}

const route = useRoute()
const store = useStore()

const props = defineProps({
  selectedZoneIngressName: {
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
const tableData = ref<{ headers: TableHeader[], data: any[] }>({
  headers: [
    { label: 'Status', key: 'status' },
    { label: 'Name', key: 'name' },
  ],
  data: [],
})
const entity = ref<ZoneIngressOverview | null>(null)
const rawData = ref<ZoneIngressOverview[]>([])
const nextUrl = ref<string | null>(null)
const subscriptionsReversed = ref<any[]>([])
const pageOffset = ref(props.offset)

watch(() => route.params.mesh, function () {
  // Don’t trigger a load when the user is navigating to another route.
  if (route.name !== 'zone-ingress-list-view') {
    return
  }

  // Ensures basic state is reset when switching meshes using the mesh selector.
  isLoading.value = true
  isEmpty.value = false
  error.value = null

  loadData(0)
})

onBeforeMount(function () {
  init(props.offset)
})

function init(offset: number): void {
  if (store.getters['config/getMulticlusterStatus']) {
    loadData(offset)
  }
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
    const { data, next } = await getZoneIngressOverviews(name, size, offset)

    // set pagination
    nextUrl.value = next

    // set table data
    if (data.length) {
      isEmpty.value = false
      rawData.value = data
      getEntity({ name: props.selectedZoneIngressName ?? data[0].name })

      tableData.value.data = data.map((zoneIngressOverview) => {
        const status = getItemStatusFromInsight(zoneIngressOverview.zoneIngressInsight ?? {})

        return { ...zoneIngressOverview, status }
      })
    } else {
      tableData.value.data = []
      isEmpty.value = true
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

function getEntity({ name }: { name: string }): void {
  const item = rawData.value.find((data) => data.name === name)

  if (item) {
    const subscriptions = item.zoneIngressInsight?.subscriptions ?? []

    subscriptionsReversed.value = Array.from(subscriptions).reverse()

    entity.value = item
    QueryParameter.set('zoneIngress', name)
  }
}

async function getZoneIngressOverviews(name: string | null, size: number, offset: number): Promise<{ data: ZoneIngressOverview[], next: string | null }> {
  if (name) {
    const zoneIngressOverview = await kumaApi.getZoneIngressOverview({ name }, { size, offset })

    return {
      data: [zoneIngressOverview],
      next: null,
    }
  } else {
    const { items, next } = await kumaApi.getAllZoneIngressOverviews({ size, offset })

    return {
      data: items ?? [],
      next,
    }
  }
}
</script>
