<template>
  <div class="component-frame">
    <DataOverview
      :page-size="PAGE_SIZE"
      :error="error"
      :has-error="error !== null"
      :is-loading="isLoading"
      :empty-state="emptyState"
      :table-data="tableData"
      :table-data-is-empty="tableData.data.length === 0"
      :next="nextUrl"
      @table-action="setActiveEntity"
      @load-data="loadData"
    />

    <ServiceDetails
      v-if="activeEntity !== null"
      class="service-details"
      :type="activeEntity.type"
      :name="activeEntity.name"
      :mesh="activeEntity.mesh"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, PropType } from 'vue'
import { useRoute } from 'vue-router'

import Kuma from '@/services/kuma'
import { STATUS } from '@/consts'
import DataOverview from '@/components/Skeletons/DataOverview.vue'
import ServiceDetails from './ServiceDetails.vue'
import { ExternalService, ServiceInsight, TableHeader } from '@/types'

const PUBLIC_LABEL = {
  ServiceInsight: 'internal services',
  ExternalService: 'external services',
}

const route = useRoute()

const props = defineProps({
  type: {
    type: String as PropType<'ServiceInsight' | 'ExternalService'>,
    required: true,
  },

  tabHeaders: {
    type: Array as PropType<TableHeader[]>,
    required: true,
  },
})

const emptyState = {
  title: 'No Data',
  message: `There are no ${PUBLIC_LABEL[props.type]} present.`,
}

const isLoading = ref(true)
const error = ref<Error | null>(null)
const nextUrl = ref<string | null>(null)
const activeEntity = ref<{ type: 'ServiceInsight' | 'ExternalService', name: string, mesh: string } | null>(null)
const tableData = ref<{ headers: TableHeader[], data: any[] }>({
  headers: props.tabHeaders,
  data: [],
})
const PAGE_SIZE = 50

watch(() => route.params.mesh, function () {
  loadData(0)
})

loadData(0)

function getAllServices(params: { size: number, offset: number }) {
  return props.type === 'ServiceInsight'
    ? Kuma.getAllServiceInsights(params)
    : Kuma.getAllExternalServices(params)
}

function getServiceFromMesh(mesh: string) {
  return props.type === 'ServiceInsight'
    ? Kuma.getAllServiceInsightsFromMesh({ mesh })
    : Kuma.getAllExternalServicesFromMesh({ mesh })
}

function processEntity(entity: ServiceInsight | ExternalService): any {
  const processedEntity: any = entity

  const nameRoute = {
    name: entity.type === 'ServiceInsight' ? 'service-insight-detail-view' : 'external-service-detail-view',
    params: {
      mesh: entity.mesh,
      service: entity.name,
    },
  }
  processedEntity.nameRoute = nameRoute

  const meshRoute = {
    name: 'mesh-child',
    params: {
      mesh: entity.mesh,
    },
  }
  processedEntity.meshRoute = meshRoute

  if (entity.type === 'ServiceInsight') {
    const { online = 0, total = 0 } = entity.dataplanes

    processedEntity.totalOnline = `${online} / ${total}`
    processedEntity.status = STATUS[entity.status].title
  } else {
    processedEntity.address = entity.networking.address
    processedEntity.tlsEnabled = entity.networking.tls.enabled ? 'Enabled' : 'Disabled'
  }

  return processedEntity
}

async function loadData(offset: number): Promise<void> {
  isLoading.value = true
  error.value = null

  const mesh = route.params.mesh as string || null

  const endpoint = () => {
    if (mesh === 'all' || mesh === null) {
      return getAllServices({ size: PAGE_SIZE, offset })
    } else {
      return getServiceFromMesh(mesh)
    }
  }

  try {
    const { items, next } = await endpoint()
    nextUrl.value = next

    items.sort((entityA, entityB) => {
      if (entityA.name > entityB.name) {
        return 1
      } else if (entityA.name < entityB.name) {
        return -1
      } else {
        return entityA.mesh.localeCompare(entityB.mesh)
      }
    })

    if (items.length > 0) {
      setActiveEntity(items[0])
      tableData.value.data = items.map((entity) => processEntity(entity))
    } else {
      activeEntity.value = null
      tableData.value.data = []
    }
  } catch (err) {
    activeEntity.value = null

    if (err instanceof Error) {
      error.value = err
    } else {
      console.error(error)
    }
  } finally {
    isLoading.value = false
  }
}

function setActiveEntity(entity: { type: 'ServiceInsight' | 'ExternalService', name: string, mesh: string }): void {
  activeEntity.value = entity
}
</script>

<style lang="scss" scoped>
.service-details {
  padding: var(--spacing-md);
}
</style>
