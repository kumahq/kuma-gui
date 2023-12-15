<template>
  <RouteView
    v-slot="{ t }"
    name="onboarding-dataplanes-view"
  >
    <RouteTitle
      :title="t('onboarding.routes.dataplanes-overview.title')"
      :render="false"
    />
    <AppView>
      <OnboardingPage>
        <template #header>
          <template
            v-for="item in [
              tableData.data.length > 0 ? 'success' : 'waiting',
            ]"
            :key="item"
          >
            <OnboardingHeading :data-testid="`state-${item}`">
              <template #title>
                {{ t(`onboarding.routes.dataplanes-overview.header.${item}.title`) }}
              </template>

              <template
                #description
              >
                <p>{{ t(`onboarding.routes.dataplanes-overview.header.${item}.description`) }}</p>
              </template>
            </OnboardingHeading>
          </template>
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
            next-step="onboarding-completed-view"
            previous-step="onboarding-add-new-services-code-view"
            :should-allow-next="tableData.data.length > 0"
          />
        </template>
      </OnboardingPage>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, ref } from 'vue'

import LoadingBox from '../components/LoadingBox.vue'
import OnboardingHeading from '../components/OnboardingHeading.vue'
import OnboardingNavigation from '../components/OnboardingNavigation.vue'
import OnboardingPage from '../components/OnboardingPage.vue'
import { useCan } from '@/app/application'
import StatusBadge from '@/app/common/StatusBadge.vue'
import { DataplaneOverview } from '@/app/data-planes/data'
import { useKumaApi } from '@/utilities'

const kumaApi = useKumaApi()
const can = useCan()

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

    if (Array.isArray(items) && items.length > 0) {
      for (const dataPlane of items) {
        const { name, mesh } = dataPlane

        const dataPlaneOverview = DataplaneOverview.fromObject(await kumaApi.getDataplaneOverviewFromMesh({ mesh, name }), can('use zones'))

        if (dataPlaneOverview.status === 'offline') {
          shouldRefetch = true
        }

        result.push({
          status: dataPlaneOverview.status,
          name,
          mesh,
        })
      }
    } else {
      shouldRefetch = true
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
