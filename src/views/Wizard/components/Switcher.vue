<template>
  <div class="wizard-switcher">
    <KEmptyState
      cta-is-hidden
      :is-error="!environment"
      class="my-6 empty-state--wide-content empty-state--compact"
    >
      <template
        v-if="environment === 'kubernetes' || environment === 'universal'"
        slot="title"
      >
        Running on <span class="env-name">{{ environment }}</span>
      </template>
      <template slot="message">
        <div v-if="environment === 'kubernetes'">
          <div v-if="this.$route.name === wizardRoutes.kubernetes">
            <p>
              We have detected that you are running on a <strong>Kubernetes environment</strong>,
              and we are going to be showing you instructions for Kubernetes unless you
              decide to visualize the instructions for Universal.
            </p>
            <p>
              <KButton
                :to="{ name: wizardRoutes.universal }"
                appearance="primary"
              >
                Switch to Universal instructions
              </KButton>
            </p>
          </div>
          <div v-else-if="this.$route.name === wizardRoutes.universal">
            <p>
              We have detected that you are running on a <strong>Kubernetes environment</strong>,
              but you are viewing instructions for Universal.
            </p>
            <p>
              <KButton
                :to="{ name: wizardRoutes.kubernetes }"
                appearance="primary"
              >
                Switch back to Kubernetes instructions
              </KButton>
            </p>
          </div>
        </div>
        <div v-else-if="environment === 'universal'">
          <div v-if="this.$route.name === wizardRoutes.kubernetes">
            <p>
              We have detected that you are running on a <strong>Universal environment</strong>,
              but you are viewing instructions for Kubernetes.
            </p>
            <p>
              <KButton
                :to="{ name: wizardRoutes.universal }"
                appearance="primary"
              >
                Switch back to Universal instructions
              </KButton>
            </p>
          </div>
          <div v-else-if="this.$route.name === wizardRoutes.universal">
            <p>
              We have detected that you are running on a <strong>Universal environment</strong>,
              and we are going to be showing you instructions for Universal unless you
              decide to visualize the instructions for Kubernetes.
            </p>
            <p>
              <KButton
                :to="{ name: wizardRoutes.kubernetes }"
                appearance="primary"
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
  data () {
    return {
      wizardRoutes: {
        kubernetes: 'kubernetes-dataplane',
        universal: 'universal-dataplane'
      }
    }
  },
  computed: {
    ...mapGetters({
      environment: 'getEnvironment'
    }),
    instructionsCtaText () {
      return (this.environment === 'universal')
        ? 'Switch to Kubernetes instructions'
        : 'Switch to Universal instructions'
    },
    instructionsCtaRoute () {
      return (this.environment === 'kubernetes')
        ? { name: 'universal-dataplane' }
        : { name: 'kubernetes-dataplane' }
    }
  }
}
</script>

<style lang="scss" scoped>
.env-name {
  text-transform: capitalize;
}
</style>
