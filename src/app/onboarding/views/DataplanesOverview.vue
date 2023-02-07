<template>
  <OnboardingPage>
    <template #header>
      <OnboardingHeading>
        <template #title>
          <p>{{ title }}</p>
        </template>

        <template
          v-if="description !== null"
          #description
        >
          <p>{{ description }}</p>
        </template>
      </onboardingheading>
    </template>

    <template #content>
      <div
        v-if="tableData.data.length === 0"
        class="status-loading-box mb-4"
      >
        <LoadingBox />
      </div>

      <div v-else>
        <p class="mb-4">
          <b>Found {{ tableData.data.length }} DPPs:</b>
        </p>

        <KTable
          class="mb-4"
          :fetcher="() => tableData"
          :headers="TABLE_HEADERS"
          disable-pagination
        >
          <template #status="{ rowValue }">
            <StatusBadge
              v-if="rowValue"
              :status="rowValue"
            />

            <template v-else>
              —
            </template>
          </template>
        </KTable>
      </div>
    </template>

    <template #navigation>
      <OnboardingNavigation
        next-step="onboarding-completed"
        previous-step="onboarding-add-services-code"
        :should-allow-next="tableData.data.length > 0"
      />
    </template>
  </OnboardingPage>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { KTable } from '@kong/kongponents'

import { getItemStatusFromInsight } from '@/utilities/dataplane'
import { kumaApi } from '@/api/kumaApi'
import LoadingBox from '../components/LoadingBox.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import OnboardingNavigation from '../components/OnboardingNavigation.vue'
import OnboardingHeading from '../components/OnboardingHeading.vue'
import OnboardingPage from '../components/OnboardingPage.vue'

const TABLE_HEADERS = [
  { label: 'Mesh', key: 'mesh' },
  { label: 'Name', key: 'name' },
  { label: 'Status', key: 'status' },
]

const tableData = ref<{ total: number, data: any [] }>({
  total: 0,
  data: [],
})
const timeout = ref<number | null>(null)

const title = computed(() => tableData.value.data.length > 0 ? 'Success' : 'Waiting for DPPs')
const description = computed(() => tableData.value.data.length > 0 ? 'The following data plane proxies (DPPs) are connected to the control plane:' : null)

onBeforeUnmount(function () {
  clearTimeout()
})

getAllDataplanes()

function clearTimeout() {
  if (timeout.value !== null) {
    window.clearTimeout(timeout.value)
  }
}

async function getAllDataplanes() {
  let shouldRefetch = false
  const result = []

  try {
    const { items } = await kumaApi.getAllDataplanes({ size: 10 })

    if (Array.isArray(items)) {
      for (const dataPlane of items) {
        const { name, mesh } = dataPlane

        const dataPlaneOverview = await kumaApi.getDataplaneOverviewFromMesh({ mesh, name })
        const status = getItemStatusFromInsight(dataPlaneOverview.dataplaneInsight)

        if (status === 'offline') {
          shouldRefetch = true
        }

        result.push({
          status,
          name,
          mesh,
        })
      }
    }
  } catch (error) {
    console.error(error)
  }

  tableData.value.data = result
  tableData.value.total = tableData.value.data.length

  if (shouldRefetch) {
    clearTimeout()
    timeout.value = window.setTimeout(getAllDataplanes, 1000)
  }
}
</script>

<style lang="scss" scoped>
.status-loading-box {
  display: flex;
  justify-content: center;
}
</style>
