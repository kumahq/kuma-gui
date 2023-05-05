<template>
  <div
    class="form-progress-bar"
    :style="`--number-of-steps: ${props.steps.length};`"
  >
    <div
      v-for="(step, index) in props.steps"
      :key="index"
      class="step"
      :class="{
        'step--is-complete': index < props.currentStepIndex,
        'step--is-in-progress': index === props.currentStepIndex,
      }"
    >
      <span class="step__icon">
        <KIcon
          v-if="index < props.currentStepIndex"
          icon="circleCheck"
          size="24"
          color="currentColor"
        />
      </span>

      {{ step }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { KIcon } from '@kong/kongponents'
import { PropType } from 'vue'

const props = defineProps({
  steps: {
    type: Array as PropType<string[]>,
    required: true,
  },

  currentStepIndex: {
    type: Number,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
.form-progress-bar {
  --step-orb-size: 24px;
  --step-orb-border-width: 2px;

  position: relative;
  display: grid;
  grid-template-columns: repeat(var(--number-of-steps, 1), 1fr);
}

.step {
  --step-orb-border-color: var(--grey-400);
  --step-bar-border-color: var(--grey-300);
  --step-text-color: var(--grey-500);

  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--step-text-color);
}

.step--is-complete {
  --step-orb-border-color: var(--teal-300);
  --step-bar-border-color: var(--teal-300);
}

.step--is-in-progress {
  --step-orb-border-color: var(--teal-300);
  --step-text-color: currentColor;

  font-weight: 600;
}

.step__icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: var(--step-orb-size);
  height: var(--step-orb-size);
  border: var(--step-orb-border-width) solid var(--step-orb-border-color);
  border-radius: 50%;
  box-shadow: 0 0 0 8px var(--white);
  color: var(--step-orb-border-color);
  background-color: var(--white);
}

.step__icon .kong-icon {
  display: block;
}

.step:not(:last-child)::after {
  content: '';
  position: absolute;
  z-index: -1;
  top: calc(var(--step-orb-size) / 2 - var(--step-orb-border-width) / 2);
  left: 50%;
  width: 100%;
  border-top: var(--step-orb-border-width) solid var(--step-bar-border-color);
}
</style>
