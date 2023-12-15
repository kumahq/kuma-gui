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
      <DataSource
        v-slot="{ error }: DataplaneOverviewCollectionSource"
        :src="hasOfflineDataplanes ? `/dataplanes/poll?page=1&size=10` : ''"
        @change="setDataplanes"
      >
        <ErrorBlock
          v-if="error !== undefined"
          :error="error"
        />

        <LoadingBlock v-else-if="dataplanes === undefined" />

        <OnboardingPage v-else>
          <template #header>
            <template
              v-for="item in [!hasOfflineDataplanes ? 'success' : 'waiting']"
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
              v-if="dataplanes.length === 0"
              class="status-loading-box mb-4"
            >
              <LoadingBox />
            </div>

            <div v-else>
              <p class="mb-4">
                <b>Found {{ dataplanes.length }} DPPs:</b>
              </p>

              <KTable
                class="mb-4"
                data-testid="dataplanes-table"
                :fetcher-cache-key="String(cacheKey)"
                :fetcher="() => ({
                  data: dataplanes,
                  total: dataplanes?.length,
                })"
                :headers="[
                  { label: 'Mesh', key: 'mesh' },
                  { label: 'Name', key: 'name' },
                  { label: 'Status', key: 'status' },
                ]"
                disable-pagination
              >
                <template #status="{ row }">
                  <StatusBadge :status="row.status" />
                </template>
              </KTable>
            </div>
          </template>

          <template #navigation>
            <OnboardingNavigation
              next-step="onboarding-completed-view"
              previous-step="onboarding-add-new-services-code-view"
              :should-allow-next="dataplanes.length > 0"
            />
          </template>
        </OnboardingPage>
      </DataSource>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

import LoadingBox from '../components/LoadingBox.vue'
import OnboardingHeading from '../components/OnboardingHeading.vue'
import OnboardingNavigation from '../components/OnboardingNavigation.vue'
import OnboardingPage from '../components/OnboardingPage.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import type { DataplaneOverview, DataplaneOverviewCollection, DataplaneOverviewCollectionSource } from '@/app/data-planes/sources'

const dataplanes = ref<DataplaneOverview[] | undefined>()
const cacheKey = ref(0)

const hasOfflineDataplanes = computed(() => {
  if (Array.isArray(dataplanes.value)) {
    return dataplanes.value.some((dataplaneOverview) => dataplaneOverview.status === 'offline')
  }

  return true
})

function setDataplanes(data: DataplaneOverviewCollection | undefined) {
  if (data) {
    dataplanes.value = data.items
    cacheKey.value++
  }
}
</script>

<style lang="scss" scoped>
.status-loading-box {
  display: flex;
  justify-content: center;
}
</style>
