<template>
  <div :class="classes">
    <KButton
      v-if="previousStep"
      appearance="primary"
      class="navigation-button navigation-button--back"
      :to="{
        name: previousStep,
      }"
      @click.native="changeStep(previousStep)"
    >
      Back
    </KButton>
    <slot />
    <KButton
      v-if="shouldDisplayNext"
      class="navigation-button navigation-button--next"
      appearance="primary"
      :to="{
        name: nextStep,
      }"
      @click.native="changeStep(nextStep)"
    >
      {{ nextStepTitle }}
    </KButton>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'OnboardingNavigation',
  props: {
    shouldDisplayNext: {
      type: Boolean,
      default: true,
    },
    nextStep: {
      type: String,
      required: true,
    },
    previousStep: {
      type: String,
      default: '',
    },
    nextStepTitle: {
      type: String,
      default: 'Next',
    },
  },
  computed: {
    classes() {
      return [
        'mt-6 flex items-center flex-col sm:flex-row',
        {
          'justify-between': this.previousStep,
          'justify-end': !this.previousStep,
        },
      ]
    },
  },
  methods: {
    ...mapActions('onboarding', ['completeOnboarding', 'changeStep']),
  },
}
</script>

<style lang="scss" scoped>
.navigation-button {
  @apply text-lg font-bold;

  --KButtonPaddingY: 12px;
  --KButtonPaddingX: 48px;
  --KButtonRadius: 25px;

  &--back {
    color: #646464 !important;
    --KButtonPrimaryBase: var(--OnboardingBackButton);
    --KButtonPrimaryHover: var(--OnboardingBackButtonHover);
    --KButtonPrimaryActive: var(--OnboardingBackButtonHover);
  }

  &--next {
    --KButtonPrimaryBase: var(--OnboardingNextButton);
    --KButtonPrimaryHover: var(--OnboardingNextButtonHover);
    --KButtonPrimaryActive: var(--OnboardingNextButtonHover);
  }
}
</style>
