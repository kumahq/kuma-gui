<template>
  <dl
    v-if="props.start.length > 0 || props.end.length > 0"
    class="x-timespan"
    data-testid="x-timespan"
  >
    <div
      v-if="props.start.length > 0"
    >
      <dt>Created</dt>
      <dd>{{ props.start }}</dd>
    </div>
    <div
      v-if="props.end.length > 0"
    >
      <dt>Modified</dt>
      <dd>{{ props.end }}</dd>
    </div>
  </dl>
</template>
<script lang="ts" setup>

const props = withDefaults(defineProps<{
  start?: string
  end?: string
}>(), {
  start: '',
  end: '',
})
</script>
<style lang="scss" scoped>
dl {
  font-size: $kui-font-size-20;
  color: $kui-color-text-neutral;
}
dl,
dl div {
  display: flex;
  flex-wrap: wrap;
}
dl {
  justify-content: flex-end;
}
dd {
  white-space: nowrap;
}
dt::after {
  content: ':';
  margin-right: $kui-space-20;
}
dl div:nth-child(2)::before {
  content: '->';
  margin: 0 $kui-space-40;
}
</style>
