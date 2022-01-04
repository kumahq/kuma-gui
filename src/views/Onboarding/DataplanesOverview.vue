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
        <Loading />
      </div>
      <div v-else>
        <p class="text-center my-4">
          You have started the first services that properly registered to {{ productName }}!
        </p>

        <div class="flex justify-center mt-10 mb-16 pb-16">
          <div class="w-full sm:w-3/5 lg:w-2/5 p-4">
            <p class="font-bold mb-4">
              Found {{ tableData.data.length }} DPPs, including:
            </p>
            <KTable
              class="onboarding-dataplane-table"
              :options="tableData"
              is-small
            >
              <template v-slot:status="{ rowValue }">
                <div
                  class="entity-status"
                  :class="{ 'is-offline': rowValue.toLowerCase() === 'offline' || rowValue === false }"
                >
                  <span class="entity-status__dot" />
                  <span class="entity-status__label">{{ rowValue }}</span>
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
        previous-step="onboarding-adding-services-code"
        :should-display-next="tableData.data.length > 0"
      />
    </template>
  </OnboardingPage>
</template>

<script>
import { PRODUCT_NAME } from '@/consts'
import { getItemStatusFromInsight } from '@/dataplane'
import Kuma from '@/services/kuma'
import Loading from '@/components/Loading'
import OnboardingNavigation from '@/views/Onboarding/components/OnboardingNavigation'
import OnboardingHeading from '@/views/Onboarding/components/OnboardingHeading'
import OnboardingPage from '@/views/Onboarding/components/OnboardingPage'

export default {
  name: 'DataplanesOverview',
  components: {
    OnboardingNavigation,
    OnboardingHeading,
    OnboardingPage,
    Loading,
  },
  metaInfo() {
    return {
      title: this.title,
    }
  },
  data() {
    return {
      productName: PRODUCT_NAME,
      tableData: {
        headers: [
          { label: 'Mesh', key: 'mesh' },
          { label: 'Name', key: 'name' },
          { label: 'Status', key: 'status' },
        ],
        data: [],
      },
    }
  },

  computed: {
    title() {
      if (this.tableData.data.length) {
        return 'Congratulations!'
      }

      return 'Waiting for DPPs'
    },
    description() {
      if (this.tableData.data.length) {
        return 'We have detected the following data plane proxies (DPPs) connecting to the control plane:'
      }

      return null
    },
  },
  created() {
    this.getAllDataplanes()
  },
  methods: {
    async getAllDataplanes() {
      const result = []

      try {
        const dataplanes = await Kuma.getAllDataplanes({ size: 10 })
        const items = dataplanes.items

        for (let i = 0; i < items.length; i++) {
          const { name, mesh } = items[i]

          const { status } = await Kuma.getDataplaneOverviewFromMesh({ mesh, name }).then((response) =>
            getItemStatusFromInsight(response.dataplaneInsight),
          )

          result.push({
            status,
            name,
            mesh,
          })
        }
      } catch (e) {
        console.error(e)
      }

      this.tableData.data = result
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
