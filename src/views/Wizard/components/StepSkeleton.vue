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
            v-for="(item, index) in steps"
            :key="item.slug"
            :aria-selected="step === item.slug ? 'true' : 'false'"
            :aria-controls="`wizard-steps__content__item--${index}`"
            :class="{ 'is-complete': (index <= start) }"
            class="wizard-steps__indicator__item"
          >
            <span>
              {{ item.label }}
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
        </form>
      </div>
      <footer
        v-if="footerEnabled"
        class="wizard-steps__footer"
      >
        <KButton
          :disabled="indexCanReverse"
          appearance="primary"
          @click="goToPrevStep"
        >
          &lsaquo; Previous
        </KButton>
        <KButton
          :disabled="indexCanAdvance || nextDisabled"
          appearance="primary"
          @click="goToNextStep"
        >
          Next &rsaquo;
        </KButton>
      </footer>
    </div>
    <aside class="wizard-steps__sidebar">
      <div class="wizard-steps__sidebar__content">
        <div
          v-for="(item, index) in sidebarContent"
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

<script>
import updateQuery from '@/views/Wizard/mixins/updateQuery'

export default {
  mixins: [
    updateQuery
  ],
  props: {
    steps: {
      type: Array,
      default: () => {}
    },
    advanceCheck: {
      type: Boolean,
      default: false
    },
    sidebarContent: {
      type: Array,
      required: true,
      default: () => {}
    },
    footerEnabled: {
      type: Boolean,
      default: true
    },
    nextDisabled: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      start: 0
    }
  },
  computed: {
    step: {
      get () {
        return this.steps[this.start].slug || 0
      },
      set (index) {
        return this.steps[index].slug
      }
    },
    indexCanAdvance () {
      return this.start >= this.steps.length - 1
    },
    indexCanReverse () {
      return this.start <= 0
    }
  },
  mounted () {
    // this clears out any old stored data upon starting the wizard
    this.resetProcess()
    // this sets the starting step upon load
    this.setStartingStep()
  },
  methods: {
    goToStep (index) {
      this.start = index
      this.updateQuery('step', index)
      this.$emit('goToStep', this.step)
    },
    goToNextStep () {
      this.start++
      this.updateQuery('step', this.start)
      this.$emit('goToNextStep', this.step)
    },
    goToPrevStep () {
      this.start--
      this.updateQuery('step', this.start)
      this.$emit('goToPrevStep', this.step)
    },
    setStartingStep () {
      const query = this.$route.query.step

      this.start = query || 0
      this.updateQuery('step', this.start)
    },
    resetProcess () {
      // revert back to the first step
      this.start = 0
      // go to first step in the UI
      if (process.env.NODE_ENV === 'production') {
        this.goToStep(0)
      }

      // clear the form data from localStorage
      localStorage.removeItem('storedFormData')
      // reset all input values so the browser can't pre-fill them
      const fields = this.$refs.wizardForm.querySelectorAll('input[type="text"]')

      fields.forEach(r => {
        r.setAttribute('value', '')
      })
    }
  }
}
</script>

<style lang="scss">
// this is a fix to accommodate for containers
// that come after the wizard container
.wizard-steps + * {

  @media screen and (min-width: 1220px) {
    width: calc(100% - 320px);
  }
}

.input-error {

}
</style>

<style lang="scss" scoped>
$sidebar-width: 320px; // was 240px
$bp-min-width: 1220px;
$bp-max-width: 1219px;

.wizard-steps {

  @media screen and (min-width: $bp-min-width) {
    display: flex;
    align-items: stretch;
    justify-content: stretch;
    margin: 0 -16px;

    .wizard-steps__content-wrapper {
      width: calc(100% - #{$sidebar-width});
      padding: 0 16px;
    }

    .wizard-steps__sidebar {
      position: fixed;
      top: 0;
      right: 0;
      padding-top: 80px;
    }

    .wizard-steps__sidebar__content {
      width: $sidebar-width;
      height: 100vh;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }

  @media screen and (max-width: $bp-max-width) {
    > * {
      margin-bottom: 16px;
    }

    .wizard-steps__sidebar {
      border-radius: 6px;
    }
  }
}

.wizard-steps__sidebar {
  background-color: var(--sidebar-bg-color);
  border: 1px solid #e6e7e8;
}

.wizard-steps__sidebar__content {
  padding: 32px;
}

.wizard-steps__sidebar__item {

  &:not(:last-of-type) {
    margin-bottom: var(--spacing-xl);
    padding-bottom: var(--spacing-xl);
    border-bottom: 1px solid #e6e7e8;
  }

  h1, h2, h3, h4, h5, h6 {
    font-size: var(--type-lg);
    margin: 0 0 var(--spacing-sm) 0;
  }

  p {

    &:not(:last-of-type) {
      margin-bottom: var(--spacing-sm);
    }
  }

  a {
    color: var(--blue-base);
    text-decoration: underline;

    &:hover, &:active {
      color: #000;
    }
  }
}

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

  li {
    display: block;
    color: var(--blue-base);
    padding: var(--spacing-md);
    background-color: var(--gray-med);
    user-select: none;
  }

  @mixin highlighted-step {
    color: var(--wizard-tab-text-selected-color);
    background-color: var(--wizard-tab-bg);
  }

  li.is-complete {
    @include highlighted-step;
  }

  li[aria-selected="true"] {
    @include highlighted-step;

    position: relative;
    border-right: 1px solid var(--wizard-tab-bg);

    // arrow
    &:after {
      --i: 20px;

      position: absolute;
      content: "";
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

.wizard-steps__content {

  p, h2, h3, h4 {
    margin-bottom: var(--spacing-md);
  }

  h2 {
    font-size: var(--type-xxl);
  }

  h3 {
    font-size: var(--type-xl);
  }

  h4 {
    font-size: var(--type-lg);
  }
}

.wizard-steps__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md) 0;
  margin: var(--spacing-xl) 0;
  border-top: 1px solid var(--grey-88);

  > *:first-of-type {
    margin-right: auto;
  }

  > *:last-of-type {
    margin-left: auto;
  }

  .k-button:after {
    display: none;
  }
}
</style>
