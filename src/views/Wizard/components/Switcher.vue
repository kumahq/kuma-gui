<template>
  <div class="wizard-switcher">
    <KEmptyState
      :is-error="!environment"
      class="my-6 empty-state--wide-content empty-state--compact"
    >
      <template
        v-if="environment === 'kubernetes' || environment === 'universal'"
        slot="title"
      >
        Running on {{ environment }}
      </template>
      <template slot="message">
        <p v-if="environment === 'kubernetes'">
          We have detected that you are running on a <strong>Kubernetes environment</strong>,
          and we are going to be showing you instructions for Kubernetes unless you
          decide to visualize the instructions for Universal.
        </p>
        <p v-else-if="environment === 'universal'">
          We have detected that you are running on a <strong>Universal environment</strong>,
          and we are going to be showing you instructions for Universal, unless you
          decide to visualize the instructions for Kubernetes.
        </p>
        <p v-else>
          We were unable to determine your environment.
        </p>
      </template>
      <template slot="cta">
        <KButton
          v-if="environment"
          :to="instructionsCtaRoute"
          appearance="primary"
        >
          {{ instructionsCtaText }}
        </KButton>
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

<style>

</style>
