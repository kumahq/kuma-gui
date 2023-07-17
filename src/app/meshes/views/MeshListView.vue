<template>
  <RouteView>
    <RouteTitle
      :title="t('meshes.routes.items.title')"
    />
    <AppView
      :breadcrumbs="[
        {
          to: {
            name: 'mesh-list-view'
          },
          text: t('meshes.routes.items.breadcrumbs')
        }
      ]"
    >
      <div class="stack">
        <div class="kcard-border">
          <DataOverview
            :page-size="PAGE_SIZE_DEFAULT"
            :is-loading="isLoading"
            :error="error"
            :empty-state="EMPTY_STATE"
            :table-data="tableData"
            :table-data-is-empty="tableData.data.length === 0"
            :next="nextUrl"
            :page-offset="pageOffset"
            @load-data="loadData"
          />
        </div>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { PropType, ref } from 'vue'
import { RouteLocationNamedRaw } from 'vue-router'

import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import DataOverview from '@/app/common/DataOverview.vue'
import { PAGE_SIZE_DEFAULT } from '@/constants'
import { Mesh, TableHeader } from '@/types/index.d'
import { useI18n, useKumaApi } from '@/utilities'
import { QueryParameter } from '@/utilities/QueryParameter'

type MeshTableRow = {
  entity: Mesh
  detailViewRoute: RouteLocationNamedRaw
}

const { t } = useI18n()
const kumaApi = useKumaApi()

const EMPTY_STATE = {
  title: t('common.emptyState.title'),
  message: t('common.emptyState.message', { type: 'Meshes' }),
}

const props = defineProps({
  selectedMeshName: {
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
const tableData = ref<{ headers: TableHeader[], data: MeshTableRow[] }>({
  headers: [
    { label: 'Name', key: 'entity' },
  ],
  data: [],
})
const nextUrl = ref<string | null>(null)
const pageOffset = ref(props.offset)

start()

function start() {
  loadData(props.offset)
}

async function loadData(offset: number) {
  pageOffset.value = offset
  // Puts the offset parameter in the URL so it can be retrieved when the user reloads the page.
  QueryParameter.set('offset', offset > 0 ? offset : null)

  isLoading.value = true
  error.value = null

  const size = PAGE_SIZE_DEFAULT

  try {
    const { items, next } = await kumaApi.getAllMeshes({ size, offset })

    nextUrl.value = next
    tableData.value.data = transformToTableData(items ?? [])
  } catch (err) {
    tableData.value.data = []

    if (err instanceof Error) {
      error.value = err
    } else {
      console.error(err)
    }
  } finally {
    isLoading.value = false
  }
}

function transformToTableData(meshInsights: Mesh[]): MeshTableRow[] {
  return meshInsights.map((entity) => {
    const { name } = entity
    const detailViewRoute: RouteLocationNamedRaw = {
      name: 'mesh-detail-view',
      params: {
        mesh: name,
      },
    }

    return {
      entity,
      detailViewRoute,
    }
  })
}
</script>
