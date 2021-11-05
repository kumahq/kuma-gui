<template>
  <span class="entity-tag">
    <span
      class="entity-tag__label"
      :class="`entity-tag__label--${cleanTagLabel(tag.label)}`"
    >
      {{ tag.label }}
    </span>
    <span
      class="entity-tag__value"
      :class="`entity-tag__value--${tag.value}`"
    >
      {{ tag.value }}
    </span>
  </span>
</template>

<script>
export default {
  name: 'EntityTag',
  props: {
    tag: {
      type: Object,
      required: true,
    },
  },
  methods: {
    cleanTagLabel(val) {
      return val.toLowerCase().replace('.', '-').replace('/', '-')
    },
  },
}
</script>

<style lang="scss" scoped>
.entity-tag {
  font-size: var(--type-xs);
  background-color: #fff;
  font-family: var(--font-family-mono);

  &:not(:last-of-type) {
    margin-right: 0.5rem;
    margin-bottom: 0.25rem;
  }

  @media (max-width: 1136px) {
    display: flex;
    flex-direction: column;
    font-size: 11px;

    .entity-tag__label {
      border-radius: 5px 5px 0 0;
    }

    .entity-tag__value {
      border-radius: 0 0 5px 5px;
    }
  }

  @media (min-width: 1137px) {
    display: inline-flex;
    align-tags: stretch;
  }
}

.entity-tag__label {
  --color: var(--blue-1);

  position: relative;
  background-color: var(--color);
  color: #fff;
  text-transform: uppercase;
  border-radius: 5px 0 0 5px;
  padding: 0.15rem 0.5rem;
  // box-shadow: inset 0 0 0 1px var(--color);
  box-shadow: inset 0 0 0 1px var(--color);
}

// this gives kuma-specific native tag a different color
// to differentiate them from user-created tag.
span[class*='kuma-io-'] {
  --color: var(--brand-color-6);

  background-color: var(--color);
  box-shadow: inset 0 0 0 1px var(--color);
}

.entity-tag__value {
  background-color: #fff;
  border-radius: 0 5px 5px 0;
  padding: 0.15rem 0.5rem 0.15rem 0.75rem;
  color: #000;
  font-weight: 500;
  box-shadow: inset 0 0 0 1px #ccc;
  // box-shadow: inset 0 0 0 1px currentColor;
}
</style>
