<template>
  <OnboardingPage>
    <template #header>
      <OnboardingHeading title="Adding a new zone" />
    </template>
    <template #content>
      <p class="text-center my-4">
        Zone status:
        <span v-if="hasZones" class="text-green-500" data-testid="zone-online">Online</span>
        <span v-else class="text-red-500" data-testid="zone-offline">Offline</span>
      </p>
      <p class="text-center mt-4 mb-10">
        Zone ingress status:
        <span v-if="hasZoneIngresses" class="text-green-500" data-testid="zone-ingress-online">Online</span>
        <span v-else class="text-red-500" data-testid="zone-ingress-offline">Offline</span>
      </p>
      <div v-if="!hasZoneIngresses || !hasZones" class="flex justify-center">
        <Loading />
      </div>
    </template>

    <template #navigation>
      <OnboardingNavigation
        next-step="onboarding-populating-mesh"
        previous-step="onboarding-multi-zone"
        :should-display-next="servicesOnline"
      />
    </template>
  </OnboardingPage>
</template>

<script>
import Kuma from '@/services/kuma'
import Loading from '@/components/Loading'
import OnboardingNavigation from '@/views/Onboarding/components/OnboardingNavigation'
import OnboardingHeading from '@/views/Onboarding/components/OnboardingHeading'
import OnboardingPage from '@/views/Onboarding/components/OnboardingPage'

const LONG_POOLING_INTERVAL = 1000

export default {
  name: 'Multizone',
  components: {
    OnboardingNavigation,
    OnboardingHeading,
    OnboardingPage,
    Loading,
  },
  metaInfo() {
    return {
      title: 'Multizone status',
    }
  },
  data() {
    return {
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
    this.getZones()
    this.getZoneIngresses()
  },

  destroyed() {
    clearTimeout(this.zoneTimeout)
    clearTimeout(this.zoneIngressTimeout)
  },
  methods: {
    async getZones() {
      try {
        const { total } = await Kuma.getZones()

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
        const { total } = await Kuma.getAllZoneIngressOverviews()

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
