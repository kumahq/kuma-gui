<template>
  <DataCard
    class="service-traffic-card"
  >
    <template #title>
      <KBadge :appearance="props.protocol === 'unknown' ? 'success' : 'default'">
        {{ t(
          `services.components.service_traffic_card.protocol.${props.protocol}`,
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
        <dt>{{ t('services.components.service_traffic_card.total') }}</dt>
        <dd>{{ t('common.formats.integer', { value: props.total }) }}</dd>
      </div>
      <div>
        <dt>{{ t('services.components.service_traffic_card.success') }}</dt>
        <dd>{{ t('common.formats.integer', { value: props.success }) }}</dd>
      </div>
    </dl>
  </DataCard>
</template>
<script lang="ts" setup>
import { useI18n } from '@/app/application'
import DataCard from '@/app/common/data-card/DataCard.vue'
const { t } = useI18n()
const props = defineProps<{
  protocol: string
  total: number
  success: number
}>()
</script>
<style lang="scss" scoped>
.title {
  font-size: $kui-font-size-40;
}

</style>
