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
    </template>

    <template #navigation>
      <OnboardingNavigation next-step="onboarding-multi-zone-status" previous-step="onboarding-backend-types" />
    </template>
  </OnboardingPage>
</template>

<script>
import OnboardingNavigation from '@/views/Onboarding/components/OnboardingNavigation'
import OnboardingHeading from '@/views/Onboarding/components/OnboardingHeading'
import OnboardingPage from '@/views/Onboarding/components/OnboardingPage'
import CodeView from '@/components/Skeletons/CodeView'

export default {
  name: 'Multizone',
  components: {
    OnboardingNavigation,
    OnboardingHeading,
    OnboardingPage,
    CodeView,
  },
  metaInfo() {
    return {
      title: 'Multizone',
    }
  },
  data() {
    return {
      documentationLink: 'https://kuma.io/docs/latest/deployments/multi-zone/#zone-control-plane',
    }
  },
}
</script>
