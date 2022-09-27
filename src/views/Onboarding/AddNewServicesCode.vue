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

      <template v-if="isKubernetes">
        <p>To run execute the following command:</p>

        <CodeBlock
          language="bash"
          :code="k8sRunCommand"
        />
      </template>

      <div v-else>
        <p>Clone the GitHub repository for the demo application:</p>

        <CodeBlock
          language="bash"
          :code="githubLink"
        />

        <KCard
          title="And follow the instructions in the README"
          border-variant="noBorder"
        >
          <template #body>
            <a
              target="_blank"
              class="external-link-code-block"
              :href="githubLinkReadme"
            >
              {{ githubLinkReadme }}
            </a>
          </template>
        </KCard>
      </div>
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
          <LoadingBox />
        </div>
      </div>
    </template>
    <template #navigation>
      <OnboardingNavigation
        next-step="onboarding-dataplanes-overview"
        previous-step="onboarding-add-services"
        :should-allow-next="hasDPPs"
      />
    </template>
  </OnboardingPage>
</template>

<script>
import { mapGetters } from 'vuex'
import json2yaml from '@appscode/json2yaml'
import { KCard } from '@kong/kongponents'

import Kuma from '@/services/kuma'
import { PRODUCT_NAME } from '@/consts'
import { kumaDpServerUrl } from '@/configUrl'
import CodeBlock from '@/components/CodeBlock.vue'
import LoadingBox from '@/components/LoadingBox.vue'
import OnboardingNavigation from '@/views/Onboarding/components/OnboardingNavigation.vue'
import OnboardingHeading from '@/views/Onboarding/components/OnboardingHeading.vue'
import OnboardingPage from '@/views/Onboarding/components/OnboardingPage.vue'

const LONG_POOLING_INTERVAL = 1000

export default {
  name: 'AddNewServicesCode',
  components: {
    CodeBlock,
    OnboardingNavigation,
    OnboardingHeading,
    OnboardingPage,
    LoadingBox,
    KCard,
  },
  metaInfo() {
    return {
      title: 'Add new services',
    }
  },
  data() {
    return {
      productName: PRODUCT_NAME,
      githubLink: 'https://github.com/kumahq/kuma-counter-demo/',
      githubLinkReadme: 'https://github.com/kumahq/kuma-counter-demo/blob/master/README.md',
      k8sRunCommand: 'kubectl apply -f https://bit.ly/3Kh2Try',
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
  unmounted() {
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
