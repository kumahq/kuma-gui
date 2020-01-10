<template>
  <div class="pagination">
    <KButton
      :disabled="!hasPrevious"
      appearance="primary"
      data-testid="previous"
      @click="$emit('previous')"
    >
      &lsaquo; Previous
    </KButton>

    <KButton
      :disabled="!hasNext"
      appearance="primary"
      data-testid="next"
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
  display: flex;
  margin-top: 16px;
  justify-content: space-between;

  button {
    font-size: 14px;
    padding: 4px 8px;

    &:nth-child(2) {
      margin-left: auto;
    }

    &:after {
      display: none;
    }
  }
}
</style>
