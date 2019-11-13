<template>
  <div class="pagination">
    <KButton
      :disabled="!hasPrevious"
      appearance="secondary"
      data-testid="previous"
      @click="$emit('previous')"
    >
      Previous
    </KButton>

    <KButton
      :disabled="!hasNext"
      appearance="secondary"
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
  }
}
</style>
