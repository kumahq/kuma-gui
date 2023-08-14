<template>
  <div class="definition-list-item">
    <dt class="definition-list-item__term">
      {{ props.term }}
    </dt>

    <dd class="definition-list-item__details">
      <slot />
    </dd>
  </div>
</template>

<script lang="ts" setup>

const props = defineProps({
  term: {
    type: String,
    required: true,
  },
})

</script>

<style lang="scss" scoped>
.definition-list-item {
  --dl-term-width: 170px;

  display: flex;
}

.definition-list-item__term {
  flex-shrink: 0;
  flex-basis: var(--dl-term-width);
  margin-right: $kui-space-50;
  font-weight: $kui-font-weight-semibold;
}

.definition-list-item__details {
  flex-grow: 1;
}
</style>
