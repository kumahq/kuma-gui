<template>
  <dl
    v-if="props.start.length > 0 || props.end.length > 0"
    class="x-timespan"
    data-testid="x-timespan"
  >
    <template
      v-if="props.start.length > 0"
    >
      <dt>{{ props.labelStart ?? t('http.api.property.creationTime') }}</dt>
      <dd>{{ props.start }}</dd>
    </template>
    <template
      v-if="props.end.length > 0"
    >
      <dt>{{ props.labelEnd ?? t('http.api.property.modificationTime') }}</dt>
      <dd>{{ props.end }}</dd>
    </template>
  </dl>
</template>
<script lang="ts" setup>
import { useI18n } from '@/app/application'
const { t } = useI18n()
const props = withDefaults(defineProps<{
  labelStart?: string
  start?: string
  labelEnd?: string
  end?: string
}>(), {
  labelStart: undefined,
  start: '',
  labelEnd: undefined,
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
