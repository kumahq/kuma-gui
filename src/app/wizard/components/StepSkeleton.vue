<template>
  <div class="wizard-steps">
    <div class="wizard-steps__content-wrapper">
      <header class="wizard-steps__indicator">
        <ul
          class="wizard-steps__indicator__controls"
          role="tablist"
          aria-label="steptabs"
        >
          <li
            v-for="(step, index) in steps"
            :key="step.slug"
            :aria-selected="stepSlug === step.slug ? 'true' : 'false'"
            :aria-controls="`wizard-steps__content__item--${index}`"
            :class="{ 'is-complete': (index <= stepIndex) }"
            class="wizard-steps__indicator__item"
          >
            <span>
              {{ step.label }}
            </span>
          </li>
        </ul>
      </header>

      <div class="wizard-steps__content">
        <form
          ref="wizardForm"
          autocomplete="off"
        >
          <div
            v-for="(step, index) in steps"
            :id="`wizard-steps__content__item--${index}`"
            :key="step.slug"
            :aria-labelledby="`wizard-steps__content__item--${index}`"
            role="tabpanel"
            tabindex="0"
            class="wizard-steps__content__item"
          >
            <slot
              v-if="stepSlug === step.slug"
              :name="step.slug"
            />
          </div>
        </form>
      </div>

      <footer
        v-if="props.footerEnabled"
        class="wizard-steps__footer"
      >
        <KButton
          v-show="!indexCanReverse"
          appearance="outline"
          data-testid="next-previous-button"
          @click="goToPrevStep"
        >
          <KIcon
            icon="chevronLeft"
            color="currentColor"
            size="16"
            hide-title
          />

          Previous
        </KButton>

        <KButton
          v-show="!indexCanAdvance"
          :disabled="props.nextDisabled"
          appearance="primary"
          data-testid="next-step-button"
          @click="goToNextStep"
        >
          Next

          <KIcon
            icon="chevronRight"
            color="currentColor"
            size="16"
            hide-title
          />
        </KButton>
      </footer>
    </div>

    <aside class="wizard-steps__sidebar">
      <div class="wizard-steps__sidebar__content">
        <div
          v-for="(item, index) in props.sidebarContent"
          :key="item.name"
          class="wizard-steps__sidebar__item"
          :class="`wizard-steps__sidebar__item--${index}`"
        >
          <slot :name="item.name" />
        </div>
      </div>
    </aside>
  </div>
</template>

<script lang="ts" setup>
import { KButton, KIcon } from '@kong/kongponents'
import { computed, onMounted, PropType, ref } from 'vue'

import { QueryParameter } from '@/utilities/QueryParameter'

const props = defineProps({
  steps: {
    type: Array as PropType<Array<{ label: string, slug: string }>>,
    required: true,
  },

  sidebarContent: {
    type: Array as PropType<Array<{ name: string }>>,
    required: true,
  },

  footerEnabled: {
    type: Boolean,
    default: true,
  },

  nextDisabled: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits<{
  (event: 'go-to-step', step: number): void
}>()

const stepIndex = ref(0)
const stepSlug = ref<string | null>(null)

const indexCanAdvance = computed(() => stepIndex.value >= props.steps.length - 1)
const indexCanReverse = computed(() => stepIndex.value <= 0)

onMounted(function () {
  const stepParameter = QueryParameter.get('step')
  stepIndex.value = stepParameter ? parseInt(stepParameter) : 0

  if (stepIndex.value in props.steps) {
    stepSlug.value = props.steps[stepIndex.value].slug
  }
})

function goToNextStep() {
  stepIndex.value++
  setStepSlug(stepIndex.value)
}

function goToPrevStep() {
  stepIndex.value--
  setStepSlug(stepIndex.value)
}

function setStepSlug(stepIndex: number): void {
  stepSlug.value = props.steps[stepIndex].slug
  QueryParameter.set('step', stepIndex)
  emit('go-to-step', stepIndex)
}
</script>

<style lang="scss">
.wizard-steps .debugger {
  padding: 10px;
  margin: 30px auto;
  font-size: 12px;
  font-family: monospace;
  background: var(--grey-300);

  h4 {
    font-size: inherit !important;
    font-weight: bold;
    text-align: center;
    text-transform: uppercase;
    margin: 0 0 5px 0 !important;
  }

  p {
    font-style: italic;
    margin: 0;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: block;
    padding: 5px 0;
    border-bottom: 1px solid var(--grey-400);
  }

  .not-set {
    color: red;
    font-weight: bold;
    font-style: italic;
  }
}

.wizard-steps__content {
  p,
  .code-block {
    margin-bottom: var(--spacing-md);
  }
}

.wizard-steps__sidebar__item {
  &:not(:last-of-type) {
    margin-bottom: var(--spacing-xl);
    padding-bottom: var(--spacing-xl);
    border-bottom: 1px solid #e6e7e8;
  }

  p:not(:last-of-type) {
    margin-bottom: var(--spacing-sm);
  }
}
</style>

<style lang="scss" scoped>
.wizard-steps {
  @media (max-width: 999.98px) {
    > :not(:first-child) {
      margin-top: var(--spacing-md);
    }
  }

  @media (min-width: 1000px) {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: var(--spacing-lg);
  }
}

.wizard-steps__sidebar {
  border-radius: 6px;
}

.wizard-steps__sidebar {
  background-color: var(--grey-100);
  border: 1px solid #e6e7e8;
}

.wizard-steps__sidebar__content {
  padding: 32px;
}

.wizard-steps__indicator {
  overflow: hidden;
  width: 100%;
}

.wizard-steps__indicator__controls {
  --wizard-tab-bg: var(--blue-700);
  --wizard-tab-text-selected-color: var(--white);

  border: 1px solid var(--grey-300);
  margin-bottom: 2rem;
  overflow: hidden;
  border-radius: 6px;

  li {
    display: block;
    color: var(--blue-base);
    padding: var(--spacing-md);
    user-select: none;
  }

  @mixin highlighted-step {
    color: var(--wizard-tab-text-selected-color);
    background-color: var(--wizard-tab-bg);
  }

  li.is-complete {
    @include highlighted-step;
  }

  li[aria-selected='true'] {
    @include highlighted-step;

    position: relative;
    border-right: 1px solid var(--wizard-tab-bg);

    // arrow
    &:after {
      --i: 20px;

      position: absolute;
      content: '';
      display: block;
      top: 0;
      right: calc(var(--i) * -1);
      width: var(--i);
      height: 100%;
      background-color: var(--wizard-tab-bg);
      clip-path: polygon(100% 50%, 9% 0, 0 0, 0 100%, 10% 100%);
    }
  }

  @media screen and (min-width: 1024px) {
    display: flex;
    align-items: stretch;
    justify-content: stretch;
    text-align: center;

    li {
      flex: 1;
    }
  }
}

.wizard-steps__content__item {
  outline: 0 !important;
}

.wizard-steps__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md) 0;
  margin: var(--spacing-xl) 0;
  border-top: 1px solid var(--grey-100);

  > *:first-of-type {
    margin-right: auto;
  }

  > *:last-of-type {
    margin-left: auto;
  }
}
</style>
