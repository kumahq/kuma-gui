<template>
  <XProvider
    name="x-table"
    :service="{ props }"
  >
    <table
      v-bind="attrs"
      :class="{
        [`variant-${props.variant}`]: true,
      }"
    >
      <slot name="default" />
    </table>
  </XProvider>
</template>
<script lang="ts" setup>
import { useAttrs } from 'vue'

const attrs = useAttrs()

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
:deep(tr) {
  th, td {
    padding-block-start: var(--x-space-40);
    padding-block-end: var(--x-space-40);
  }
}

/* variants */
table.variant-kv {
  :deep(thead tr) {
    th:nth-child(2):last-child {
      text-align: right;
    }
  }
  :deep(thead tr) {
    border-block-end: var(--x-border-width-10) solid var(--x-color-border);
  }
  :deep(tr):not(:first-child) {
    border-block-start: var(--x-border-width-10) solid var(--x-color-border);
  }
  :deep(tr) {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    td:only-child {
      width: 100%;
    }
    th[scope="row"] {
      & {
        font-weight: var(--x-font-weight-regular);
      }
      + td {
        font-weight: var(--x-font-weight-bold);
        text-align: right;
        li {
          list-style-type: none;
        }
      }
    }
  }
}
</style>
