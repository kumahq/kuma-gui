<template>
  <RouteView
    v-slot="{ can, t }"
    name="onboarding-add-new-services"
  >
    <RouteTitle
      :title="t('onboarding.routes.add-services-code.title')"
      :render="false"
    />
    <AppView>
      <OnboardingPage>
        <template #header>
          <OnboardingHeading>
            <template #title>
              Add services
            </template>
          </OnboardingHeading>
        </template>

        <template #content>
          <p class="mb-4 text-center">
            The demo application includes two services: a Redis backend to store a counter value, and a frontend web UI to show and increment the counter.
          </p>

          <template v-if="can('use kubernetes')">
            <p>To run execute the following command:</p>

            <CodeBlock
              language="bash"
              :code="k8sRunCommand"
            />
          </template>

          <div v-else>
            <p class="mb-4 text-center">
              Clone <a
                :href="githubLink"
                target="_blank"
              >the GitHub repository</a> for the demo application:
            </p>

            <CodeBlock
              language="bash"
              :code="`git clone ${githubLink}`"
            />

            <p class="mt-4 text-center">
              And follow the instructions in <a
                :href="githubLinkReadme"
                target="_blank"
              >the README</a>.
            </p>
          </div>

          <div>
            <p class="status-box mt-4">
              DPPs status:

              <span
                v-if="hasDPPs"
                class="status--is-connected"
                data-testid="dpps-connected"
              >Connected</span>

              <span
                v-else
                class="status--is-disconnected"
                data-testid="dpps-disconnected"
              >Disconnected</span>
            </p>

            <div
              v-if="!hasDPPs"
              class="status-loading-box mt-4"
            >
              <LoadingBox />
            </div>
          </div>
        </template>

        <template #navigation>
          <OnboardingNavigation
            next-step="onboarding-dataplanes-view"
            previous-step="onboarding-add-new-services-view"
            :should-allow-next="hasDPPs"
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
import CodeBlock from '@/app/common/code-block/CodeBlock.vue'
import { useKumaApi } from '@/utilities'

const kumaApi = useKumaApi()

const LONG_POOLING_INTERVAL = 1000

const githubLink = 'https://github.com/kumahq/kuma-counter-demo/'
const githubLinkReadme = 'https://github.com/kumahq/kuma-counter-demo/blob/master/README.md'
const k8sRunCommand = 'kubectl apply -f https://bit.ly/3Kh2Try'

const hasDPPs = ref(false)
const dppsTimeout = ref<number | null>(null)

getDPPs()

onUnmounted(function () {
  clearTimeout()
})

async function getDPPs() {
  try {
    const { total } = await kumaApi.getAllDataplanes()

    hasDPPs.value = total > 0
  } catch (err) {
    console.error(err)
  } finally {
    if (!hasDPPs.value) {
      clearTimeout()
      dppsTimeout.value = window.setTimeout(() => getDPPs(), LONG_POOLING_INTERVAL)
    }
  }
}

function clearTimeout(): void {
  if (dppsTimeout.value !== null) {
    window.clearTimeout(dppsTimeout.value)
  }
}
</script>

<style lang="scss" scoped>
.status-box {
  text-align: center;
}

.status--is-connected {
  color: $kui-color-text-success;
}

.status--is-disconnected {
  color: $kui-color-text-danger;
}

.status-loading-box {
  display: flex;
  justify-content: center;
}
</style>
