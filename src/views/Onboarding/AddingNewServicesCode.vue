<template>
  <OnboardingPage>
    <template #header>
      <OnboardingHeading title="Adding new services" />
    </template>
    <template #content>
      <p class="text-center mb-12">
        {{ productName }} ships with a counter demo application that showcases a very simple application
        with two services, a Redis backend to store the counter value and a frontend application.
      </p>

      <CodeView
        title="You can find the counter demo application at the following GitHub repository:"
        copy-button-text="Copy Command to Clipboard"
        lang="bash"
        :content="githubLink"
      />
      <CodeView
        v-if="isKubernetes"
        title="Then run the following command:"
        copy-button-text="Copy Command to Clipboard"
        lang="bash"
        :content="k8sRunCommand"
      />
      <CodeView
        v-else
        title="Please follow the instructions in the Readme.md"
        copy-button-text="Copy Command to Clipboard"
        lang="bash"
        :content="githubLinkReadme"
      />
      <div>
        <p class="text-center font-medium my-4">
          To proceed you need to setup DPPs
        </p>
        <p class="text-center my-4">
          DPPs status:
          <span
            v-if="hasDPPs"
            class="text-green-500"
            data-testid="dpps-connected"
          >Connected</span>
          <span
            v-else
            class="text-red-500"
            data-testid="dpps-disconnected"
          >Disconeccted</span>
        </p>
        <div
          v-if="!hasDPPs"
          class="flex justify-center"
        >
          <Loading />
        </div>
      </div>
    </template>
    <template #navigation>
      <OnboardingNavigation
        next-step="onboarding-dataplanes-overview"
        previous-step="onboarding-adding-services"
        :should-display-next="hasDPPs"
      />
    </template>
  </OnboardingPage>
</template>

<script>
import Kuma from '@/services/kuma'
import { mapGetters } from 'vuex'
import { PRODUCT_NAME } from '@/consts'
import { kumaDpServerUrl } from '@/configUrl'
import json2yaml from '@appscode/json2yaml'
import Loading from '@/components/Loading'
import CodeView from '@/components/Skeletons/CodeView'
import OnboardingNavigation from '@/views/Onboarding/components/OnboardingNavigation'
import OnboardingHeading from '@/views/Onboarding/components/OnboardingHeading'
import OnboardingPage from '@/views/Onboarding/components/OnboardingPage'

const LONG_POOLING_INTERVAL = 1000

export default {
  name: 'AddingNewServicesCode',
  components: {
    CodeView,
    OnboardingNavigation,
    OnboardingHeading,
    OnboardingPage,
    Loading,
  },
  metaInfo() {
    return {
      title: 'Adding new services',
    }
  },
  data() {
    return {
      productName: PRODUCT_NAME,
      githubLink: 'https://github.com/kumahq/kuma-counter-demo/',
      githubLinkReadme: 'https://github.com/kumahq/kuma-counter-demo/blob/master/README.md',
      k8sRunCommand: 'kubectl apply -f demo.yaml',
      generateDpTokenCode: 'kumactl generate dataplane-token --name=redis > kuma-token-redis',
      startDpCode: `kuma-dp run \\
      --cp-address=${kumaDpServerUrl()} \\
      --dataplane=${`"${json2yaml({
        type: 'Dataplane',
        mesh: 'default',
        name: 'example',
        networking: {
          address: 'localhost',
          inbound: [
            {
              port: 7777,
              servicePort: 7777,
              serviceAddress: '127.0.0.1',
              tags: {
                'kuma.io/service': 'example',
                'kuma.io/protocol': 'tcp',
              },
            },
          ],
        },
      })}"`} \\
      --dataplane-token-file=kuma-token-example`,
      hasDPPs: false,
      DPPsTimeout: null,
    }
  },
  computed: {
    ...mapGetters({
      environment: 'config/getEnvironment',
    }),
    isKubernetes() {
      return this.environment === 'kubernetes'
    },
  },
  created() {
    // TODO before merge remove
    setTimeout(() => {
      this.getDPPs()
    }, 2000)
  },
  destroyed() {
    clearTimeout(this.DPPsTimeout)
  },

  methods: {
    async getDPPs() {
      try {
        const { total } = await Kuma.getAllDataplanes()

        this.hasDPPs = total > 0
      } catch (e) {
        console.error(e)
      }

      if (!this.hasDPPs) {
        this.DPPsTimeout = setTimeout(() => this.getDPPs(), LONG_POOLING_INTERVAL)
      }
    },
  },
}
</script>
