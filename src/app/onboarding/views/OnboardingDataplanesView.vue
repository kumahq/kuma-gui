<template>
  <RouteView
    name="onboarding-dataplanes-view"
    v-slot="{ t }"
  >
    <RouteTitle
      :title="t('onboarding.routes.dataplanes-overview.title')"
      :render="false"
    />
    <AppView>
      <DataSource
        :src="`/dataplanes/poll?page=1&size=10`"
        v-slot="{ data, error }: DataplaneOverviewCollectionSource"
      >
        <template
          v-for="offline in [(data?.items ?? []).some(item => item.status !== 'online')]"
          :key="offline"
        >
          <OnboardingPage>
            <template #header>
              <template
                v-for="item in [offline ? 'waiting' : 'success']"
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
              <DataLoader
                :data="[data]"
                :errors="[error]"
              >
                <template
                  #connecting
                >
                  <div
                    class="status-loading-box mb-4"
                  >
                    <LoadingBox />
                  </div>
                </template>

                <div v-if="data">
                  <p>
                    <strong>
                      Found {{ data.items.length }} DPPs:
                    </strong>
                  </p>
                  <KTable
                    class="mb-4"
                    data-testid="dataplanes-table"
                    :fetcher-cache-key="JSON.stringify(data)"
                    :fetcher="((data) => {
                      return () => {
                        return {
                          data: data.items,
                          total: data.items.length,
                        }
                      }})(data)"
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
              </DataLoader>
            </template>

            <template #navigation>
              <OnboardingNavigation
                next-step="onboarding-completed-view"
                previous-step="onboarding-add-new-services-code-view"
                :should-allow-next="(data?.items ?? []).length > 0"
              />
            </template>
          </OnboardingPage>
        </template>
      </DataSource>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>

import LoadingBox from '../components/LoadingBox.vue'
import OnboardingHeading from '../components/OnboardingHeading.vue'
import OnboardingNavigation from '../components/OnboardingNavigation.vue'
import OnboardingPage from '../components/OnboardingPage.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import type { DataplaneOverviewCollectionSource } from '@/app/data-planes/sources'

</script>

<style lang="scss" scoped>
.status-loading-box {
  display: flex;
  justify-content: center;
}
</style>
