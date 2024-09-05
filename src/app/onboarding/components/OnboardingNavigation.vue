<template>
  <div class="onboarding-actions">
    <XAction
      v-if="props.previousStep"
      appearance="secondary"
      :to="{ name: props.previousStep }"
      data-testid="onboarding-previous-button"
    >
      Back
    </XAction>

    <div class="button-list">
      <XAction
        v-if="props.showSkip"
        appearance="tertiary"
        data-testid="onboarding-skip-button"
        :to="{ name: 'home' }"
      >
        Skip setup
      </XAction>

      <XAction
        :disabled="!props.shouldAllowNext"
        appearance="primary"
        :to="{ name: props.lastStep ? 'home' : props.nextStep }"
        data-testid="onboarding-next-button"
      >
        {{ props.nextStepTitle }}
      </XAction>
    </div>
  </div>
</template>

<script lang="ts" setup>

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
  gap: $kui-space-50;
}
</style>
