<template>
  <div class="form-line-wrapper">
    <div class="form-line">
      <div class="form-line__col">
        <label
          :for="forAttr"
          class="k-input-label"
        >
          {{ title }}:
        </label>
      </div>
      <div class="form-line__col">
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
      required: true
    },
    forAttr: {
      type: String,
      required: false,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
$padding: 16px;
$first-col-width: 30%;
$last-col-flex: 1 0 0;

.form-line-wrapper {
  overflow: hidden;
}

.form-line {
  margin: #{$padding / 2} -#{$padding};

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
