<template>
  <DataCard
    class="service-traffic-card"
    @click="click"
  >
    <template #title>
      <KBadge :appearance="props.protocol === 'passthrough' ? 'success' : 'info'">
        {{ t(
          `data-planes.components.service_traffic_card.protocol.${props.protocol}`,
          {},
          {
            defaultMessage: t(`http.api.value.${props.protocol}`),
          },
        ) }}
      </KBadge>
      <div class="title">
        <slot name="default" />
      </div>
    </template>

    <template
      v-if="props.traffic"
    >
      <template v-if="props.traffic.name.length > 0">
        <!-- rx and tx are purposefully reversed in all the below to rx=tx and tx=rx here due to the direction of the traffic (downstream) -->
        <dl>
          <template
            v-if="props.protocol === 'passthrough'"
          >
            <template
              v-for="(item, key) in [
                (['http', 'tcp'] as const).reduce((prev, protocol) => {
                  const direction = 'downstream'
                  // sum both the properties we need from both protocols
                  return Object.entries(props.traffic?.[protocol] || {}).reduce((prev, [key, value]) => {
                    return [`${direction}_cx_tx_bytes_total`, `${direction}_cx_rx_bytes_total`].includes(key) ?
                      { ...prev, [key]: (value as number) + (prev[key] ?? 0) } :
                      prev
                  }, prev)
                }, {} as Record<string, number>),
              ]"
              :key="key"
            >
              <div>
                <dt>{{ t('data-planes.components.service_traffic_card.tx') }}</dt>
                <dd>{{ t('common.formats.bytes', { value: item.downstream_cx_rx_bytes_total as (number | undefined) ?? 0 }) }}</dd>
              </div>
              <div>
                <dt>{{ t('data-planes.components.service_traffic_card.rx') }}</dt>
                <dd>{{ t('common.formats.bytes', { value: item.downstream_cx_tx_bytes_total as (number | undefined) ?? 0 }) }}</dd>
              </div>
            </template>
          </template>
          <template
            v-else-if="props.protocol === 'grpc'"
          >
            <div>
              <dt>{{ t('data-planes.components.service_traffic_card.grpc_success') }}</dt>
              <dd>{{ t('common.formats.integer', { value: props.traffic.grpc?.success as (number | undefined) ?? 0 }) }}</dd>
            </div>
            <div>
              <dt>{{ t('data-planes.components.service_traffic_card.grpc_failure') }}</dt>
              <dd>{{ t('common.formats.integer', { value: props.traffic.grpc?.failure as (number | undefined) ?? 0 }) }}</dd>
            </div>
          </template>
          <template
            v-else-if="props.protocol === 'http'"
          >
            <div
              v-for="value in [props.traffic.http?.downstream_rq_1xx as (number | undefined) ?? 0].filter(item => item !== 0)"
              :key="value"
            >
              <dt>{{ t('data-planes.components.service_traffic_card.1xx') }}</dt>
              <dd>{{ t('common.formats.integer', { value: value }) }}</dd>
            </div>
            <div>
              <dt>{{ t('data-planes.components.service_traffic_card.2xx') }}</dt>
              <dd>{{ t('common.formats.integer', { value: props.traffic.http?.downstream_rq_2xx as (number | undefined) ?? 0 }) }}</dd>
            </div>
            <div
              v-for="value in [props.traffic.http?.downstream_rq_3xx as (number | undefined) ?? 0].filter(item => item !== 0)"
              :key="value"
            >
              <dt>{{ t('data-planes.components.service_traffic_card.3xx') }}</dt>
              <dd>{{ t('common.formats.integer', { value: value }) }}</dd>
            </div>
            <div>
              <dt>{{ t('data-planes.components.service_traffic_card.4xx') }}</dt>
              <dd>{{ t('common.formats.integer', { value: props.traffic.http?.downstream_rq_4xx as (number | undefined) ?? 0 }) }}</dd>
            </div>
            <div>
              <dt>{{ t('data-planes.components.service_traffic_card.5xx') }}</dt>
              <dd>{{ t('common.formats.integer', { value: props.traffic.http?.downstream_rq_5xx as (number | undefined) ?? 0 }) }}</dd>
            </div>
          </template>
          <template
            v-else
          >
            <div>
              <dt>{{ t('data-planes.components.service_traffic_card.tx') }}</dt>
              <dd>{{ t('common.formats.bytes', { value: props.traffic.tcp?.downstream_cx_rx_bytes_total as (number | undefined) ?? 0 }) }}</dd>
            </div>
            <div>
              <dt>{{ t('data-planes.components.service_traffic_card.rx') }}</dt>
              <dd>{{ t('common.formats.bytes', { value: props.traffic.tcp?.downstream_cx_tx_bytes_total as (number | undefined) ?? 0 }) }}</dd>
            </div>
          </template>
        </dl>
      </template>
    </template>
    <template v-else>
      <KSkeletonBox
        :width="10"
      />
    </template>
  </DataCard>
</template>
<script lang="ts" setup>
import type { TrafficEntry } from '../../data'
import { useI18n } from '@/app/application'
import DataCard from '@/app/common/data-card/DataCard.vue'
const { t } = useI18n()
const props = defineProps<{
  protocol: string
  traffic?: TrafficEntry
}>()
const click = (e: MouseEvent) => {
  const $target = e.target as HTMLElement
  if ($target.nodeName.toLowerCase() !== 'a') {
    const $el = $target.closest('.service-traffic-card')
    if ($el) {
      const $a = $el.querySelector('a')
      if ($a !== null) {
        $a.click()
      }
    }
  }
}

</script>
<style lang="scss" scoped>
.title {
  font-size: $kui-font-size-40;
  display: flex;
  flex: 1 1 auto;
}
.title :deep(> a) {
  text-decoration: none;
  color: inherit;
}
</style>
