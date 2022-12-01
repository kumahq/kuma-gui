<template>
  <OnboardingPage>
    <template #header>
      <OnboardingHeading
        :title="title"
        :description="description"
      />
    </template>

    <template #content>
      <div
        v-if="!tableData.data.length"
        class="justify-center flex my-4"
      >
        <LoadingBox />
      </div>

      <div v-else>
        <div class="flex justify-center mt-10 mb-16 pb-16">
          <div class="w-full sm:w-3/5 p-4">
            <p class="font-bold mb-4">
              Found {{ tableData.data.length }} DPPs:
            </p>

            <KTable
              class="onboarding-dataplane-table"
              :fetcher="() => tableData"
              :headers="tableHeaders"
              disable-pagination
              is-small
            >
              <template #status="{ rowValue }">
                <div
                  class="entity-status"
                  :class="{
                    'is-offline': rowValue.toLowerCase() === 'offline' || rowValue === false,
                    'is-online': rowValue.toLowerCase() === 'online',
                    'is-degraded': rowValue.toLowerCase() === 'partially degraded',
                    'is-not-available': rowValue.toLowerCase() === 'not available',
                  }"
                >
                  <span>{{ rowValue }}</span>
                </div>
              </template>
            </KTable>
          </div>
        </div>
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

<script>
import { KTable } from '@kong/kongponents'

import { PRODUCT_NAME, OFFLINE } from '@/constants'
import { getItemStatusFromInsight } from '@/utilities/dataplane'
import { kumaApi } from '@/api/kumaApi'
import LoadingBox from '@/app/common/LoadingBox.vue'
import OnboardingNavigation from '../components/OnboardingNavigation.vue'
import OnboardingHeading from '../components/OnboardingHeading.vue'
import OnboardingPage from '../components/OnboardingPage.vue'

export default {
  name: 'DataplanesOverview',
  components: {
    OnboardingNavigation,
    OnboardingHeading,
    OnboardingPage,
    LoadingBox,
    KTable,
  },
  metaInfo() {
    return {
      title: this.title,
    }
  },
  data() {
    return {
      productName: PRODUCT_NAME,
      tableHeaders: [
        { label: 'Mesh', key: 'mesh' },
        { label: 'Name', key: 'name' },
        { label: 'Status', key: 'status' },
      ],
      tableData: {
        total: 0,
        data: [],
      },
      timeout: null,
    }
  },

  computed: {
    title() {
      if (this.tableData.data.length) {
        return 'Success'
      }

      return 'Waiting for DPPs'
    },
    description() {
      if (this.tableData.data.length) {
        return 'The following data plane proxies (DPPs) are connected to the control plane:'
      }

      return null
    },
  },
  created() {
    this.getAllDataplanes()
  },
  beforeUnmount() {
    clearTimeout(this.timeout)
  },
  methods: {
    async getAllDataplanes() {
      let shouldRefetch = false
      const result = []

      try {
        const { items } = await kumaApi.getAllDataplanes({ size: 10 })

        if (Array.isArray(items)) {
          for (let i = 0; i < items.length; i++) {
            const { name, mesh } = items[i]

            const { status } = await kumaApi.getDataplaneOverviewFromMesh({ mesh, name }).then((response) =>
              getItemStatusFromInsight(response.dataplaneInsight),
            )

            if (status === OFFLINE) {
              shouldRefetch = true
            }

            result.push({
              status,
              name,
              mesh,
            })
          }
        }
      } catch (e) {
        console.error(e)
      }

      this.tableData.data = result
      this.tableData.total = this.tableData.data.length

      if (shouldRefetch) {
        this.timeout = setTimeout(() => {
          this.getAllDataplanes()
        }, 1000)
      }
    },
  },
}
</script>

<style lang="scss">
.onboarding-dataplane-table tbody tr {
  // hack to do not allow shadow overflow on top/bottom
  box-shadow: -3px 0 0 -1px var(--KTableBorder, var(--steel-200, #dae3f2)) !important;
}
</style>
