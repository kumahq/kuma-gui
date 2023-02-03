<template>
  <OnboardingPage>
    <template #header>
      <OnboardingHeading>
        <template #title>
          Add zones
        </template>
      </OnboardingHeading>
    </template>

    <template #content>
      <p class="text-center mb-4">
        A zone requires both the zone control plane and zone ingress. On Kubernetes, you run a single command to create both resources. On Universal, you must create them separately.
      </p>

      <KCard
        title="See the documentation for options to install:"
        border-variant="noBorder"
      >
        <template #body>
          <a
            target="_blank"
            class="external-link-code-block"
            :href="`${env('KUMA_DOCS_URL')}/deployments/multi-zone/?${env('KUMA_UTM_QUERY_PARAMS')}#zone-control-plane`"
          >
            {{ env('KUMA_DOCS_URL') }}/deployments/multi-zone/#zone-control-plane
          </a>
        </template>
      </KCard>

      <div>
        <p class="text-center my-4">
          Zone status:
          <span
            v-if="hasZones"
            class="text-green-500"
            data-testid="zone-connected"
          >Connected</span>

          <span
            v-else
            class="text-red-500"
            data-testid="zone-disconnected"
          >Disconnected</span>
        </p>

        <p class="text-center mt-4 mb-10">
          Zone ingress status:
          <span
            v-if="hasZoneIngresses"
            class="text-green-500"
            data-testid="zone-ingress-connected"
          >Connected</span>

          <span
            v-else
            class="text-red-500"
            data-testid="zone-ingress-disconnected"
          >Disconnected</span>
        </p>

        <div
          v-if="!hasZoneIngresses || !hasZones"
          class="flex justify-center"
        >
          <LoadingBox />
        </div>
      </div>
    </template>

    <template #navigation>
      <OnboardingNavigation
        next-step="onboarding-create-mesh"
        previous-step="onboarding-configuration-types"
        :should-allow-next="servicesOnline"
      />
    </template>
  </OnboardingPage>
</template>

<script>
import { KCard } from '@kong/kongponents'

import { kumaApi } from '@/api/kumaApi'
import LoadingBox from '@/app/common/LoadingBox.vue'
import OnboardingNavigation from '../components/OnboardingNavigation.vue'
import OnboardingHeading from '../components/OnboardingHeading.vue'
import OnboardingPage from '../components/OnboardingPage.vue'
import { useEnv } from '@/utilities'
const env = useEnv()

const LONG_POOLING_INTERVAL = 1000

export default {
  name: 'MultiZoneView',
  components: {
    OnboardingNavigation,
    OnboardingHeading,
    OnboardingPage,
    LoadingBox,
    KCard,
  },
  data() {
    return {
      env,
      hasZones: false,
      hasZoneIngresses: false,
      zoneTimeout: null,
      zoneIngressTimeout: null,
    }
  },
  computed: {
    servicesOnline() {
      return this.hasZoneIngresses && this.hasZones
    },
  },

  created() {
    this.getZoneIngresses()
    this.getZones()
  },
  unmounted() {
    clearTimeout(this.zoneTimeout)
    clearTimeout(this.zoneIngressTimeout)
  },
  methods: {
    async getZones() {
      try {
        const { total } = await kumaApi.getZones()

        this.hasZones = total > 0
      } catch (e) {
        console.error(e)
      }

      if (!this.hasZones) {
        this.zoneTimeout = setTimeout(() => this.getZones(), LONG_POOLING_INTERVAL)
      }
    },
    async getZoneIngresses() {
      try {
        const { total } = await kumaApi.getAllZoneIngressOverviews()

        this.hasZoneIngresses = total > 0
      } catch (e) {
        console.error(e)
      }

      if (!this.hasZoneIngresses) {
        this.zoneIngressTimeout = setTimeout(() => this.getZoneIngresses(), LONG_POOLING_INTERVAL)
      }
    },
  },
}
</script>
