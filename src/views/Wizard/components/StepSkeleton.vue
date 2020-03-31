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
            class="wizard-steps__indicator__item"
          >
            <a @click.prevent="goToStep(index)">
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
            :disabled="advanceCheck === false || indexCanAdvance"
            appearance="primary"
            @click="goToNextStep"
          >
            Next
          </KButton>
        </p>
      </footer>
    </div>
    <aside class="wizard-steps__sidebar">
      <div
        v-for="(item, index) in sidebarContent"
        :key="item.name"
        class="wizard-steps__sidebar__item"
        :class="`wizard-steps__sidebar__item--${index}`"
      >
        <slot :name="item.name" />
      </div>
    </aside>
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
    },
    sidebarContent: {
      type: Array,
      required: true,
      default: () => {}
    }
  },
  data () {
    return {
      start: 0
    }
  },
  computed: {
    indexCanAdvance () {
      return this.start >= this.steps.length - 1
    },
    step: {
      get () {
        return this.steps[this.start].slug
      },
      set (index) {
        return this.steps[index].slug
      }
    },
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
    goToStep (index) {
      this.start = index
      this.$emit('goToStep', this.step)
    },
    goToNextStep () {
      this.start++
      this.$emit('goToNextStep', this.step)
    }
  }
}
</script>

<style lang="scss" scoped>
.wizard-steps {

  @media screen and (min-width: 1220px) {
    display: flex;
    align-items: stretch;
    justify-content: stretch;
    margin: 0 -16px;

    > * {
      margin: 0 16px;
    }

    .wizard-steps__content-wrapper {
      width: 75%;
    }

    .wizard-steps__sidebar {
      flex: 1;
    }
  }

  @media screen and (max-width: 1219px) {
    > * {
      margin-bottom: 16px;
    }
  }
}

.wizard-steps__sidebar {
  background-color: var(--sidebar-bg-color);
  padding: 32px;
  border-radius: 6px;
  border: 1px solid #e6e7e8;
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
