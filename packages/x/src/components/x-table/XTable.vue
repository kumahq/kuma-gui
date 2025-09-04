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
  vertical-align: top;
}
:deep(thead tr) {
  th {
    border-block-end: $kui-border-width-10 solid $kui-color-border;
  }
}
:deep(tr) {
  th, td {
    padding-block-start: $kui-space-40;
    padding-block-end: $kui-space-40;
  }
}
table:not(.variant-kv) {
  :deep(tbody tr), table :deep(> tr) {
    &:not(:first-child) {
      th, td {
        border-block-start: $kui-border-width-10 solid $kui-color-border;
      }
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
  :deep(tbody tr), :deep(> tr) {
    display: flex;
    justify-content: space-between;
    &:not(:first-child) {
      border-block-start: $kui-border-width-10 solid $kui-color-border;
    }
    td:only-child {
      width: 100%;
    }
    th[scope="row"] {
      & {
        font-weight: $kui-font-weight-regular;
      }
      + td {
        font-weight: $kui-font-weight-bold;
      }
    }
  }
}
</style>
