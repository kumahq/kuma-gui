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
          :disabled="advanceCheck === false"
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
    },
    advanceCheck: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      step: this.steps[0].slug
    }
  },
  computed: {
    selected: {
      get () {
        return this.step
      },
      set (newStep) {
        return newStep
      }
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
  --wizard-tab-bg: var(--blue-4);
  --wizard-tab-text-selected-color: #fff;

  border: 1px solid var(--gray-4);
  margin-bottom: 2rem;
  overflow: hidden;
  border-radius: 6px;

  a {
    display: block;
    color: var(--blue-base);
    text-decoration: underline;
    padding: var(--spacing-md);
    background-color: var(--gray-med);
    text-decoration: none;
    cursor: pointer;
    user-select: none;
  }

  li[aria-selected="true"] a {
    position: relative;
    color: var(--wizard-tab-text-selected-color);
    background-color: var(--wizard-tab-bg);

    &:before, &:after {
      position: absolute;
      content: "";
      display: block;
    }

    // underline
    // &:before {
    //   bottom: -2px;
    //   left: 0;
    //   width: 100%;
    //   height: 2px;
    //   background-color: var(--blue-4);
    // }

    // arrow
    &:after {
      --i: 20px;
      top: 0;
      right: calc(var(--i) * -1);
      width: var(--i);
      height: 100%;
      background-color: var(--wizard-tab-bg);
      clip-path: polygon(0 0, 100% 50%, 0 100%);
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

.wizard-steps__footer {
  text-align: right;
  padding: var(--spacing-md) 0;
  margin: var(--spacing-xl) 0;
  border-top: 1px solid var(--grey-88);
}
</style>
