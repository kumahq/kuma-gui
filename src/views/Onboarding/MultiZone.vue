<template>
  <OnboardingPage>
    <template #header>
      <OnboardingHeading title="Adding a new zone" />
    </template>
    <template #content>
      <p class="text-center mb-4">
        In a multi-zone deployment, in order to start our service mesh we must first add a new zone to our deployment by
        starting a Zone CP and its Ingress/Egress.
      </p>

      <p class="text-center my-8">
        A Zone CP will ultimately receive connections from the data plane proxies in the same zone, therefore it needs
        to be configured in such a way that this connectivity is possible. There is no strict rule to how big or small a
        zone can be as long as this requriement is satisifed. Therefore, a Zone CP can be a Kubernetes cluster, a VPC, a
        cloud or region.
      </p>

      <CodeView
        title="To get started adding a new Zone, please follow the steps from link below:"
        copy-button-text="Copy link"
        lang="bash"
        :content="documentationLink"
      />
      <div>
        <p class="text-center font-medium my-4">
          To proceed you need to setup Zones & Zone Ingress
        </p>
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
          <Loading />
        </div>
      </div>
    </template>

    <template #navigation>
      <OnboardingNavigation
        next-step="onboarding-populating-mesh"
        previous-step="onboarding-backend-types"
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
import CodeView from '@/components/Skeletons/CodeView'

const LONG_POOLING_INTERVAL = 1000

export default {
  name: 'Multizone',
  components: {
    OnboardingNavigation,
    OnboardingHeading,
    OnboardingPage,
    CodeView,
    Loading,
  },
  metaInfo() {
    return {
      title: 'Multizone',
    }
  },
  data() {
    return {
      documentationLink: 'https://kuma.io/docs/latest/deployments/multi-zone/#zone-control-plane',
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
