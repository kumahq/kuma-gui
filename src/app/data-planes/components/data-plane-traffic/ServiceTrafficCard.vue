<template>
  <DataCard
    class="service-traffic-card"
  >
    <template #title>
      <KBadge :appearance="props.protocol === 'unknown' ? 'success' : 'default'">
        {{ t(
          `data-planes.components.service_traffic_card.protocol.${props.protocol}`,
          {},
          {
            defaultMessage: t(`http.api.value.${props.protocol}`),
          },
        ) }}
      </KBadge>
      <span class="title">
        <slot name="default" />
      </span>
    </template>
    <dl>
      <div>
        <dt>{{ t('data-planes.components.service_traffic_card.tx') }}</dt>
        <dd>{{ t('common.formats.integer', { value: props.tx }) }}</dd>
      </div>
      <div>
        <dt>{{ t('data-planes.components.service_traffic_card.rx') }}</dt>
        <dd>{{ t('common.formats.integer', { value: props.rx }) }}</dd>
      </div>
      <div
        v-if="typeof props.requests !== 'undefined'"
      >
        <dt>{{ t('data-planes.components.service_traffic_card.requests') }}</dt>
        <dd>{{ t('common.formats.integer', { value: props.requests }) }}</dd>
      </div>
    </dl>
  </DataCard>
</template>
<script lang="ts" setup>
import { useI18n } from '@/app/application'
import DataCard from '@/app/common/data-card/DataCard.vue'
const { t } = useI18n()
const props = withDefaults(defineProps<{
  protocol: string
  requests?: number
  rx: number
  tx: number
}>(), {
  requests: undefined,
  rx: 0,
  tx: 0,
})

</script>
<style lang="scss" scoped>
.title {
  font-size: $kui-font-size-40;
}

</style>
