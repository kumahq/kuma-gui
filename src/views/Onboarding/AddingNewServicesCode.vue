<template>
  <OnboardingPage>
    <template #header>
      <OnboardingHeading title="Add services" />
    </template>
    <template #content>
      <p class="text-center mb-12">
        The demo application includes two services: a Redis backend to store a counter value,
        and a frontend web UI to show and increment the counter.
      </p>

      <CodeView
        title="Clone the GitHub repository for the demo application:"
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
        title="And follow the instructions in the README"
        copy-button-text="Copy Command to Clipboard"
        lang="bash"
        :content="githubLinkReadme"
      />
      <div>
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
    this.getDPPs()
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
