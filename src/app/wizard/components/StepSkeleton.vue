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
          v-show="!indexCanReverse"
          appearance="outline"
          @click="goToPrevStep"
        >
          &lsaquo; Previous
        </KButton>
        <KButton
          v-show="!indexCanAdvance"
          :disabled="nextDisabled"
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
import { KButton } from '@kong/kongponents'

export default {
  components: {
    KButton,
  },

  props: {
    steps: {
      type: Array,
      default: () => {},
    },
    sidebarContent: {
      type: Array,
      required: true,
      default: () => {},
    },
    footerEnabled: {
      type: Boolean,
      default: true,
    },
    nextDisabled: {
      type: Boolean,
      default: true,
    },
  },

  emits: ['goToStep'],

  data() {
    return {
      start: 0,
    }
  },
  computed: {
    step: {
      get() {
        return this.steps[this.start].slug
      },
      set(index) {
        return this.steps[index].slug
      },
    },
    indexCanAdvance() {
      return this.start >= this.steps.length - 1
    },
    indexCanReverse() {
      return this.start <= 0
    },
  },

  mounted() {
    // this sets the starting step upon load
    this.setStartingStep()
  },

  methods: {
    goToNextStep() {
      this.start++
      this.updateQuery('step', this.start)
      this.$emit('goToStep', this.step)
    },
    goToPrevStep() {
      this.start--
      this.updateQuery('step', this.start)
      this.$emit('goToStep', this.step)
    },
    updateQuery(query, value) {
      const router = this.$router
      const route = this.$route

      // explanation of hack https://github.com/vuejs/vue-router/issues/2872
      if (!route.query) {
        // if the URL contains no current queries, simply add the query and value
        router.push({
          query: {
            [query]: value,
          },
        })
      } else {
        router.push({
          query: Object.assign({}, route.query, { [query]: value }),
        })
      }
    },
    setStartingStep() {
      const query = this.$route.query.step

      this.start = query || 0
    },
  },
}
</script>

<style lang="scss">
.wizard-steps .debugger {
  padding: 10px;
  margin: 30px auto;
  font-size: 12px;
  font-family: monospace;
  background: #eee;

  h4 {
    font-size: inherit !important;
    font-weight: 700;
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
    border-bottom: 1px solid #ccc;
  }

  .not-set {
    color: red;
    font-weight: bold;
    font-style: italic;
  }
}

.wizard-steps__content {
  p,
  h2,
  h3,
  h4,
  .code-block {
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

.wizard-steps__sidebar__item {
  &:not(:last-of-type) {
    margin-bottom: var(--spacing-xl);
    padding-bottom: var(--spacing-xl);
    border-bottom: 1px solid #e6e7e8;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: var(--type-lg);
    margin: 0 0 var(--spacing-sm) 0;
  }

  p {
    &:not(:last-of-type) {
      margin-bottom: var(--spacing-sm);
    }
  }
}
</style>

<style lang="scss" scoped>
$sidebar-width: 320px; // was 240px
$bp-min-width: 1220px;
$bp-lg-min-width: 1760px;
$bp-max-width: 1219px;

.wizard-steps {
  @media screen and (min-width: $bp-min-width) {
    display: flex;
    align-items: stretch;
    justify-content: center;
    margin-right: calc(320px - 44px);

    .wizard-steps__content-wrapper {
      width: 800px;
      padding: 0 16px;
    }

    .wizard-steps__sidebar {
      position: absolute;
      top: 0;
      right: 0;
      padding-top: 80px;
    }

    .wizard-steps__sidebar__content {
      width: $sidebar-width;
      height: calc(100vh - 80px);
      overflow-y: auto;
      overflow-x: hidden;
    }
  }

  @media screen and (min-width: $bp-lg-min-width) {
    .wizard-steps__content-wrapper {
      width: 1000px;
      padding: 0 16px;
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

.wizard-steps__indicator {
  overflow: hidden;
  width: 100%;
}

.wizard-steps__indicator__controls {
  --wizard-tab-bg: var(--WizardTabBGColor);
  --wizard-tab-text-selected-color: var(--WizardTabTextColor);

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
  border-top: 1px solid var(--grey-88);

  > *:first-of-type {
    margin-right: auto;
  }

  > *:last-of-type {
    margin-left: auto;
  }
}
</style>
