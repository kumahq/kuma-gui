<template>
  <div class="pagination">
    <KButton
      v-if="hasPrevious"
      ref="paginatePrev"
      appearance="primary"
      @click="$emit('previous')"
    >
      &lsaquo; Previous
    </KButton>

    <KButton
      v-if="hasNext"
      ref="paginateNext"
      appearance="primary"
      @click="$emit('next')"
    >
      Next &rsaquo;
    </KButton>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    hasPrevious: {
      type: Boolean,
      default: false
    },
    hasNext: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination {
  // display: flex;
  // justify-content: space-between;
  padding: var(--spacing-sm);
  text-align: right;

  button {
    font-size: 14px;
    padding: 4px 8px;

    &:not(:first-of-type) {
      margin-left: var(--spacing-sm);
    }

    &:after {
      display: none;
    }
  }
}
</style>
