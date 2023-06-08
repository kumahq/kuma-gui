<template>
  <RouteView>
    <RouteTitle
      :title="t('onboarding.routes.multizone.title')"
    />
    <AppView>
      <OnboardingPage>
        <template #header>
          <OnboardingHeading>
            <template #title>
              Add zones
            </template>
          </OnboardingHeading>
        </template>

        <template #content>
          <p class="mb-4 text-center">
            A zone requires both the zone control plane and zone ingress. On Kubernetes, you run a single command to create both resources. On Universal, you must create them separately.
          </p>

          <p class="mb-4 text-center">
            <b>See <a
              :href="`${env('KUMA_DOCS_URL')}/deployments/multi-zone/?${env('KUMA_UTM_QUERY_PARAMS')}#zone-control-plane`"
              target="_blank"
            >the documentation for options to install</a>.</b>
          </p>

          <div>
            <p class="status-box mt-4">
              Zone status:

              <span
                v-if="hasZones"
                class="status--is-connected"
                data-testid="zone-connected"
              >Connected</span>

              <span
                v-else
                class="status--is-disconnected"
                data-testid="zone-disconnected"
              >Disconnected</span>
            </p>

            <p class="status-box mt-4">
              Zone ingress status:

              <span
                v-if="hasZoneIngresses"
                class="status--is-connected"
                data-testid="zone-ingress-connected"
              >Connected</span>

              <span
                v-else
                class="status--is-disconnected"
                data-testid="zone-ingress-disconnected"
              >Disconnected</span>
            </p>

            <div
              v-if="!hasZoneIngresses || !hasZones"
              class="status-loading-box mt-4"
            >
              <LoadingBox />
            </div>
          </div>
        </template>

        <template #navigation>
          <OnboardingNavigation
            next-step="onboarding-create-mesh"
            previous-step="onboarding-configuration-types"
            :should-allow-next="hasZones && hasZoneIngresses"
          />
        </template>
      </OnboardingPage>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { onUnmounted, ref } from 'vue'

import LoadingBox from '../components/LoadingBox.vue'
import OnboardingHeading from '../components/OnboardingHeading.vue'
import OnboardingNavigation from '../components/OnboardingNavigation.vue'
import OnboardingPage from '../components/OnboardingPage.vue'
import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import { useEnv, useKumaApi, useI18n } from '@/utilities'

const kumaApi = useKumaApi()
const env = useEnv()
const { t } = useI18n()

const LONG_POLLING_INTERVAL = 1000

const hasZones = ref(false)
const hasZoneIngresses = ref(false)
const zoneTimeout = ref<number | null>(null)
const zoneIngressTimeout = ref<number | null>(null)

onUnmounted(function () {
  clearZoneTimeout()
  clearZoneIngressTimeout()
})

getZones()
getZoneIngresses()

async function getZones() {
  try {
    const { total } = await kumaApi.getZones()

    hasZones.value = total > 0
  } catch (error) {
    hasZones.value = false

    console.error(error)
  } finally {
    if (!hasZones.value) {
      clearZoneTimeout()
      zoneTimeout.value = window.setTimeout(getZones, LONG_POLLING_INTERVAL)
    }
  }
}

async function getZoneIngresses() {
  try {
    const { total } = await kumaApi.getAllZoneIngressOverviews()

    hasZoneIngresses.value = total > 0
  } catch (error) {
    hasZoneIngresses.value = false

    console.error(error)
  } finally {
    if (!hasZoneIngresses.value) {
      clearZoneIngressTimeout()
      zoneIngressTimeout.value = window.setTimeout(getZoneIngresses, LONG_POLLING_INTERVAL)
    }
  }
}

function clearZoneTimeout() {
  if (zoneTimeout.value !== null) {
    window.clearTimeout(zoneTimeout.value)
  }
}

function clearZoneIngressTimeout() {
  if (zoneIngressTimeout.value !== null) {
    window.clearTimeout(zoneIngressTimeout.value)
  }
}
</script>

<style lang="scss" scoped>
.status-box {
  text-align: center;
}

.status--is-connected {
  color: var(--green-500);
}

.status--is-disconnected {
  color: var(--red-500);
}

.status-loading-box {
  display: flex;
  justify-content: center;
}
</style>
