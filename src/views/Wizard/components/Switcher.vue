<template>
  <div class="wizard-switcher">
    <KEmptyState
      ref="emptyState"
      cta-is-hidden
      :is-error="!environment"
      class="my-6 wizard-empty-state"
    >
      <template
        v-if="environment === 'kubernetes' || environment === 'universal'"
        v-slot:title
      >
        Running on <span class="env-name">{{ environment }}</span>
      </template>
      <template v-slot:message>
        <div v-if="environment === 'kubernetes'">
          <div v-if="$route.name === wizardRoutes.kubernetes">
            <p>
              We have detected that you are running on a <strong>Kubernetes environment</strong>,
              and we are going to be showing you instructions for Kubernetes unless you
              decide to visualize the instructions for Universal.
            </p>
            <p>
              <KButton
                :to="{ name: wizardRoutes.universal }"
                appearance="secondary"
              >
                Switch to Universal instructions
              </KButton>
            </p>
          </div>
          <div v-else-if="$route.name === wizardRoutes.universal">
            <p>
              We have detected that you are running on a <strong>Kubernetes environment</strong>,
              but you are viewing instructions for Universal.
            </p>
            <p>
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
          <div v-if="$route.name === wizardRoutes.kubernetes">
            <p>
              We have detected that you are running on a <strong>Universal environment</strong>,
              but you are viewing instructions for Kubernetes.
            </p>
            <p>
              <KButton
                :to="{ name: wizardRoutes.universal }"
                appearance="secondary"
              >
                Switch back to Universal instructions
              </KButton>
            </p>
          </div>
          <div v-else-if="$route.name === wizardRoutes.universal">
            <p>
              We have detected that you are running on a <strong>Universal environment</strong>,
              and we are going to be showing you instructions for Universal unless you
              decide to visualize the instructions for Kubernetes.
            </p>
            <p>
              <KButton
                :to="{ name: wizardRoutes.kubernetes }"
                appearance="secondary"
              >
                Switch to Kubernetes instructions
              </KButton>
            </p>
          </div>
        </div>
      </template>
    </KEmptyState>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Switcher',
  data() {
    return {
      wizardRoutes: {
        kubernetes: 'kubernetes-dataplane',
        universal: 'universal-dataplane',
      },
    }
  },
  computed: {
    ...mapGetters({
      environment: 'config/getEnvironment',
    }),
    instructionsCtaText() {
      return this.environment === 'universal' ? 'Switch to Kubernetes instructions' : 'Switch to Universal instructions'
    },
    instructionsCtaRoute() {
      return this.environment === 'kubernetes' ? { name: 'universal-dataplane' } : { name: 'kubernetes-dataplane' }
    },
  },
}
</script>

<style lang="scss" scoped>
.env-name {
  text-transform: capitalize;
}
</style>
