<template>
  <RouteView
    name="onboarding-add-new-services"
    v-slot="{ can, t }"
  >
    <RouteTitle
      :title="t('onboarding.routes.add-services-code.title')"
      :render="false"
    />
    <AppView>
      <DataSource
        :src="`/dataplanes/online?page=1&size=10`"
        v-slot="{ data, error }: DataplaneOverviewCollectionSource"
      >
        <OnboardingPage>
          <template #header>
            <OnboardingHeading>
              <template #title>
                Add services
              </template>
            </OnboardingHeading>
          </template>

          <template #content>
            <p class="mb-4 text-center">
              The demo application includes two services: a Redis backend to store a counter value, and a frontend web UI to show and increment the counter.
            </p>

            <template v-if="can('use kubernetes')">
              <p>To run execute the following command:</p>

              <XCodeBlock
                language="bash"
                :code="t('onboarding.routes.add-services-code.k8s')"
              />
            </template>

            <div v-else>
              <p class="mb-4 text-center">
                Clone <a
                  :href="t('onboarding.routes.add-services-code.repo')"
                  target="_blank"
                >the GitHub repository</a> for the demo application:
              </p>

              <XCodeBlock
                language="bash"
                :code="`git clone ${t('onboarding.routes.add-services-code.repo')}`"
              />

              <p class="mt-4 text-center">
                And follow the instructions in <a
                  :href="t('onboarding.routes.add-services-code.readme')"
                  target="_blank"
                >the README</a>.
              </p>
            </div>

            <div>
              <DataLoader
                :data="[data]"
                :errors="[error]"
                :loader="false"
              >
                <p class="status-box mt-4">
                  DPPs status:

                  <span
                    v-if="typeof data !== 'undefined'"
                    class="status--is-connected"
                    data-testid="dpps-connected"
                  >Connected</span>

                  <span
                    v-else
                    class="status--is-disconnected"
                    data-testid="dpps-disconnected"
                  >Disconnected</span>
                </p>

                <div
                  v-if="typeof data === 'undefined'"
                  class="status-loading-box mt-4"
                >
                  <LoadingBox />
                </div>
              </DataLoader>
            </div>
          </template>

          <template #navigation>
            <OnboardingNavigation
              next-step="onboarding-dataplanes-view"
              previous-step="onboarding-add-new-services-view"
              :should-allow-next="typeof data !== 'undefined'"
            />
          </template>
        </OnboardingPage>
      </DataSource>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import LoadingBox from '../components/LoadingBox.vue'
import OnboardingHeading from '../components/OnboardingHeading.vue'
import OnboardingNavigation from '../components/OnboardingNavigation.vue'
import OnboardingPage from '../components/OnboardingPage.vue'
import type { DataplaneOverviewCollectionSource } from '@/app/data-planes/sources'
</script>

<style lang="scss" scoped>
.status-box {
  text-align: center;
}

.status--is-connected {
  color: $kui-color-text-success;
}

.status--is-disconnected {
  color: $kui-color-text-danger;
}

.status-loading-box {
  display: flex;
  justify-content: center;
}
</style>
