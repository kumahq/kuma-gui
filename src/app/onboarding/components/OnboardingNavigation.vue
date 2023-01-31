<template>
  <div class="onboarding-actions">
    <KButton
      v-if="props.previousStep"
      appearance="secondary"
      :to="{ name: props.previousStep }"
      data-testid="onboarding-previous-button"
      @click="changeStep(props.previousStep)"
    >
      Back
    </KButton>

    <div class="button-list">
      <KButton
        v-if="props.showSkip"
        appearance="outline"
        data-testid="onboarding-skip-button"
        :to="{ name: 'home' }"
        @click="skipOnboarding"
      >
        Skip setup
      </KButton>

      <KButton
        :disabled="!props.shouldAllowNext"
        :appearance="props.lastStep ? 'creation' : 'primary'"
        :to="{ name: props.lastStep ? 'home' : props.nextStep }"
        data-testid="onboarding-next-button"
        @click="props.lastStep ? skipOnboarding() : changeStep(props.nextStep)"
      >
        {{ props.nextStepTitle }}
      </KButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { KButton } from '@kong/kongponents'

import { useStore } from '@/store/store'

const store = useStore()

const props = defineProps({
  shouldAllowNext: {
    type: Boolean,
    required: false,
    default: true,
  },

  showSkip: {
    type: Boolean,
    required: false,
    default: true,
  },

  nextStep: {
    type: String,
    required: true,
  },

  previousStep: {
    type: String,
    required: false,
    default: '',
  },

  nextStepTitle: {
    type: String,
    required: false,
    default: 'Next',
  },

  lastStep: {
    type: Boolean,
    required: false,
    default: false,
  },
})

function skipOnboarding(): void {
  store.dispatch('onboarding/completeOnboarding')
}

function changeStep(step: string): void {
  store.dispatch('onboarding/changeStep', step)
}
</script>

<style lang="scss" scoped>
.onboarding-actions {
  display: flex;
  justify-content: space-between;
}

.button-list {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}
</style>
