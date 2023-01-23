<template>
  <div class="wizard-switcher">
    <KCard
      ref="emptyState"
      cta-is-hidden
      :is-error="!environment"
      class="my-6"
    >
      <template
        v-if="environment === 'kubernetes' || environment === 'universal'"
        #title
      >
        Running on <span class="capitalize">{{ environment }}</span>
      </template>

      <template #body>
        <div v-if="environment === 'kubernetes'">
          <div v-if="route.name === wizardRoutes.kubernetes">
            <p>
              We have detected that you are running on a <strong>Kubernetes environment</strong>,
              and we are going to be showing you instructions for Kubernetes unless you
              decide to visualize the instructions for Universal.
            </p>
            <p class="text-center">
              <KButton
                :to="{ name: wizardRoutes.universal }"
                appearance="secondary"
              >
                Switch to<br>
                Universal instructions
              </KButton>
            </p>
          </div>
          <div v-else-if="route.name === wizardRoutes.universal">
            <p>
              We have detected that you are running on a <strong>Kubernetes environment</strong>,
              but you are viewing instructions for Universal.
            </p>
            <p class="text-center">
              <KButton
                :to="{ name: wizardRoutes.kubernetes }"
                appearance="secondary"
              >
                Switch back to Kubernetes instructions
              </KButton>
            </p>
          </div>
        </div>
        <div v-else-if="environment === 'universal'">
          <div v-if="route.name === wizardRoutes.kubernetes">
            <p>
              We have detected that you are running on a <strong>Universal environment</strong>,
              but you are viewing instructions for Kubernetes.
            </p>
            <p class="text-center">
              <KButton
                :to="{ name: wizardRoutes.universal }"
                appearance="secondary"
              >
                Switch back to Universal instructions
              </KButton>
            </p>
          </div>
          <div v-else-if="route.name === wizardRoutes.universal">
            <p>
              We have detected that you are running on a <strong>Universal environment</strong>,
              and we are going to be showing you instructions for Universal unless you
              decide to visualize the instructions for Kubernetes.
            </p>
            <p class="text-center">
              <KButton
                :to="{ name: wizardRoutes.kubernetes }"
                appearance="secondary"
              >
                Switch to
                Kubernetes instructions
              </KButton>
            </p>
          </div>
        </div>
      </template>
    </KCard>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { KButton, KCard } from '@kong/kongponents'

import { useStore } from '@/store/store'

const wizardRoutes = {
  kubernetes: 'kubernetes-dataplane',
  universal: 'universal-dataplane',
}

const route = useRoute()
const store = useStore()

const environment = computed(() => store.getters['config/getEnvironment'])
</script>

<style lang="scss" scoped>
.capitalize {
  display: inline-block;
  text-transform: capitalize;
}
</style>
