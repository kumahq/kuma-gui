<template>
  <OnboardingPage>
    <template #header>
      <OnboardingHeading
        title="Adding new services"
        :description="
          `${productName} ships with a counter demo application that showcases a very simple application with two services, a Redis backend to store the counter value and a frontend application.`
        "
      />
    </template>
    <template #content>
      <div v-if="onboardingMode==='demo'">
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
      </div>
    </template>
    <template #navigation>
      <OnboardingNavigation
        next-step="onboarding-dataplanes-overview"
        previous-step="onboarding-adding-dpp"
      />
    </template>
  </OnboardingPage>
</template>

<script>
import { mapGetters } from 'vuex'
import { PRODUCT_NAME } from '@/consts'
import { kumaDpServerUrl } from '@/configUrl'
import json2yaml from '@appscode/json2yaml'
import CodeView from '@/components/Skeletons/CodeView'
import OnboardingNavigation from '@/views/Onboarding/components/OnboardingNavigation'
import OnboardingHeading from '@/views/Onboarding/components/OnboardingHeading'
import OnboardingPage from '@/views/Onboarding/components/OnboardingPage'

export default {
  name: 'AddingNewServicesCode',
  components: {
    CodeView,
    OnboardingNavigation,
    OnboardingHeading,
    OnboardingPage,
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
    }
  },
  computed: {
    ...mapGetters({
      onboardingMode: 'onboarding/getMode',
      environment: 'config/getEnvironment',
    }),
    isKubernetes() {
      return this.environment === 'kubernetes'
    },
  },
}
</script>
