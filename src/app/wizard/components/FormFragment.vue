<template>
  <div class="form-line-wrapper">
    <div
      class="form-line"
      :class="{ 'has-equal-cols': equalCols }"
    >
      <div
        v-if="!hideLabelCol"
        class="form-line__col"
      >
        <label
          :for="forAttr"
          class="k-input-label"
        >
          {{ title }}:
        </label>
      </div>
      <div
        class="form-line__col"
        :class="{ 'is-inline': allInline, 'is-shifted-right': shiftRight }"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormFragment',
  props: {
    title: {
      type: String,
      required: false,
      default: null,
    },
    forAttr: {
      type: String,
      required: false,
      default: null,
    },
    allInline: {
      type: Boolean,
      default: false,
    },
    hideLabelCol: {
      type: Boolean,
      default: false,
    },
    equalCols: {
      type: Boolean,
      default: false,
    },
    shiftRight: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
@use 'sass:math';

$padding: 16px;
$first-col-width: 30%;

.form-line-wrapper {
  overflow: hidden;
}

.form-line {
  margin: #{math.div($padding, 2)} - #{$padding};

  .code-sample {
    font-family: var(--font-family-mono);
    white-space: pre-line !important;
  }

  @media screen and (min-width: 1024px) {
    display: flex;
    align-items: center;

    .form-line__col {
      padding: 0 $padding;
    }

    .form-line__col:first-of-type {
      width: $first-col-width;
      text-align: right;
    }

    .form-line__col:last-of-type {
      flex: 1 0 0;
    }

    .is-shifted-right {
      display: block;

      > :slotted(*) {
        display: flex;
        width: 70%;
        flex: none !important;
        margin-left: auto !important;

        > * {
          flex: 1 0 0;
        }
      }
    }

    .is-inline {
      display: flex;
      align-items: center;
      margin: 0 -16px;

      > :slotted(*) {
        flex: 1 0 0;
        margin: 0 8px;
      }
    }

    &.has-equal-cols {
      > * {
        flex: 1 0 0;
        margin: 0 8px;
      }

      .form-line__col {
        text-align: left;
      }

      :slotted(input + span) {
        margin-left: 8px;
      }
    }
  }

  @media screen and (max-width: 1023px) {
    margin-left: 0;
    margin-right: 0;

    .form-line__col {
      margin: 0 0 $padding 0;
    }
  }
}
</style>
