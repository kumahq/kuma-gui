<template>
  <table
    :class="{
      [`variant-${props.variant}`]: true,
    }"
  >
    <slot name="default" />
  </table>
</template>
<script lang="ts" setup>

const props = defineProps<{
  variant: 'kv'
}>()
</script>

<style lang="scss" scoped>
table {
  width: 100%;
}
:deep(th) {
  text-align: left;
}
:deep(thead tr) {
  th {
    border-block-end: $kui-border-width-10 solid $kui-color-border;
  }
}
:deep(tr) {
  th, td {
    margin-block-start: $kui-space-40;
    padding-block-start: $kui-space-40;
    padding-block-end: $kui-space-40;
  }
}
:deep(tbody tr) {
  &:not(:first-child) {
    th, td {
      border-block-start: $kui-border-width-10 solid $kui-color-border;
    }
  }
}

/* variants */
table.variant-kv {
  :deep(thead tr) {
    th:nth-child(2):last-child {
      text-align: right;
    }
  }
  :deep(tbody tr) {
    th[scope="row"] {
      & {
        font-weight: $kui-font-weight-regular;
      }
      + td {
        font-weight: $kui-font-weight-bold;
        text-align: right;
      }
    }
  }
}
</style>
