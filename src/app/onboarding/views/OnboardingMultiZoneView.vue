<template>
  <RouteView
    v-slot="{ t }"
    name="onboarding-multi-zone-view"
  >
    <RouteTitle
      :title="t('onboarding.routes.multizone.title')"
      :render="false"
    />
    <AppView>
      <DataSource
        v-slot="{ data, error }: ZoneOverviewCollectionSource"
        :src="`/zone-cps/~online?page=1&size=10`"
      >
        <DataSource
          v-slot="{ data: ingresses, error: ingressesError }: ZoneIngressOverviewCollectionSource"
          :src="`/zone-ingress-overviews/~online?page=1&size=10`"
        >
          <OnboardingPage>
            <template #header>
              <OnboardingHeading>
                <template #title>
                  Add zones
                </template>
              </OnboardingHeading>
            </template>

            <template #content>
              <div
                class="onboarding-multi-zone-view-body"
                v-html="t('onboarding.routes.multizone.body')"
              />

              <div>
                <DataLoader
                  :data="[data, ingresses]"
                  :errors="[error, ingressesError]"
                  :loader="false"
                >
                  <template
                    v-for="status in [{
                      zone: typeof data !== 'undefined' ? 'online' : 'offline',
                      ingress: typeof ingresses !== 'undefined' ? 'online' : 'offline',
                    }]"
                    :key="status"
                  >
                    <div
                      class="onboarding-multi-zone-view-status"
                      :data-testid="`zone-${status.zone}-ingress-${status.ingress}`"
                      v-html="t('onboarding.routes.multizone.status', {
                        zone: status.zone,
                        ingress: status.ingress,
                      })"
                    />

                    <div
                      v-if="(['zone', 'ingress'] as const).some(item => status[item] === 'offline')"
                      class="onboarding-multi-zone-view-status-loading"
                    >
                      <LoadingBox />
                    </div>
                  </template>
                </DataLoader>
              </div>
            </template>

            <template #navigation>
              <OnboardingNavigation
                next-step="onboarding-create-mesh-view"
                previous-step="onboarding-configuration-types-view"
                :should-allow-next="typeof ingresses !== 'undefined' || typeof data !== 'undefined'"
              />
            </template>
          </OnboardingPage>
        </DataSource>
      </DataSource>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import LoadingBox from '../components/LoadingBox.vue'
import OnboardingHeading from '../components/OnboardingHeading.vue'
import OnboardingNavigation from '../components/OnboardingNavigation.vue'
import OnboardingPage from '../components/OnboardingPage.vue'
import { ZoneIngressOverviewCollectionSource } from '@/app/zone-ingresses/sources'
import { ZoneOverviewCollectionSource } from '@/app/zones/sources'
</script>

<style lang="scss">
.onboarding-multi-zone-view-body {
  text-align: center;
}
.onboarding-multi-zone-view-status {
  text-align: center;
  margin-top: $kui-space-60;
  p {
    em {
      color: $kui-color-text-success;
      font-style: normal;
    }
    strong {
      color: $kui-color-text-danger;
      font-weight: $kui-font-weight-regular;
    }
  }
}
.onboarding-multi-zone-view-status-loading {
  margin-top: $kui-space-60;
  display: flex;
  justify-content: center;
}
</style>
