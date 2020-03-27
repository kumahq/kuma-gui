<template>
  <div class="wizard-steps">
    <header class="wizard-steps__indicator">
      <ul
        class="wizard-steps__indicator__controls"
        role="tablist"
        aria-label="steptabs"
      >
        <li
          v-for="(item, index) in steps"
          :key="item.slug"
          :aria-selected="step === item.slug ? 'true' : 'false'"
          :aria-controls="`wizard-steps__content__item--${index}`"
          class="wizard-steps__indicator__item"
        >
          <a @click.prevent="goToNextStep(item.slug)">
            {{ item.label }}
          </a>
        </li>
      </ul>
    </header>
    <div class="wizard-steps__content">
      <div
        v-for="(item, index) in steps"
        :id="`wizard-steps__content__item--${index}`"
        :key="item.slug"
        :aria-labelledby="`wizard-steps__content__item--${index}`"
        role="tabpanel"
        tabindex="0"
        class="wizard-steps__content__item"
      >
        <slot
          v-if="step === item.slug"
          :name="item.slug"
        />
      </div>
    </div>
    <footer class="wizard-steps__footer">
      <p>
        <KButton
          :disabled="!canProgress"
          appearance="primary"
          @click="goToNextStep(selected)"
        >
          Next
        </KButton>
      </p>
    </footer>
  </div>
</template>

<script>
export default {
  props: {
    steps: {
      type: Array,
      default: () => {}
    }
  },
  data () {
    return {
      step: this.steps[0].slug,
      canProgress: false
    }
  },
  methods: {
    goToNextStep (slug) {
      this.step = slug
      this.$emit('nextStep', slug)
    }
  }
}
</script>

<style lang="scss" scoped>
.wizard-steps__indicator {
  overflow: hidden;
  width: 100%;
}

.wizard-steps__indicator__controls {
  display: flex;
  align-items: stretch;
  justify-content: stretch;

  li {
    flex: 1;
  }

  a {
    display: block;
    color: var(--blue-base);
    text-decoration: underline;
    padding: var(--spacing-md);
    background-color: var(--gray-med);
  }
}

.form-line {
  display: flex;
  overflow: hidden;
  align-items: center;
  margin: 16px -16px;

  label {
    text-align: right;
  }

  > * {
    padding: 0 16px;
  }
}

.wizard-steps__footer {
  text-align: right;
  padding: var(--spacing-md) 0;
  margin: var(--spacing-xl) 0;
  border-top: 1px solid var(--grey-88);
}
</style>
