<template>
  <DataCard
    class="service-traffic-card"
    @click="click"
  >
    <template #title>
      <TagList
        v-if="props.service.length > 0"
        :tags="[{label: 'kuma.io/service', value: props.service}]"
      />
      <div class="title">
        <XBadge
          v-if="props.protocol !== ''"
          class="protocol"
          :appearance="props.protocol === 'passthrough' ? 'success' : 'info'"
        >
          {{ t(
            `data-planes.components.service_traffic_card.protocol.${props.protocol}`,
            {},
            {
              defaultMessage: t(`http.api.value.${props.protocol}`),
            },
          ) }}
        </XBadge>
        <slot name="default" />
      </div>
    </template>

    <template v-if="props.portName">
      <dl>
        <div>
          <dt>Name</dt>
          <dd>
            {{ props.portName }}
          </dd>
        </div>
      </dl>
    </template>

    <template
      v-if="props.traffic"
    >
      <!-- rx and tx are purposefully reversed in all the below to rx=tx and tx=rx here due to the direction of the traffic (downstream) -->
      <dl>
        <template
          v-if="props.protocol === 'passthrough'"
        >
          <template
            v-for="(item, key) in [
              ['http', 'tcp'].reduce((prev, protocol) => {
                const direction = props.direction
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
              <dd>{{ formatBytes(item.downstream_cx_rx_bytes_total as (number | undefined) ?? 0) }}</dd>
            </div>
            <div>
              <dt>{{ t('data-planes.components.service_traffic_card.rx') }}</dt>
              <dd>{{ formatBytes(item.downstream_cx_tx_bytes_total as (number | undefined) ?? 0) }}</dd>
            </div>
          </template>
        </template>
        <template
          v-else-if="props.protocol === 'grpc'"
        >
          <div
            data-testid="grpc-success"
          >
            <dt>{{ t('data-planes.components.service_traffic_card.grpc_success') }}</dt>
            <dd>{{ t('common.formats.integer', { value: props.traffic.grpc?.success }) }}</dd>
          </div>
          <div
            data-testid="grpc-failure"
          >
            <dt>{{ t('data-planes.components.service_traffic_card.grpc_failure') }}</dt>
            <dd>{{ t('common.formats.integer', { value: props.traffic.grpc?.failure }) }}</dd>
          </div>
        </template>
        <template
          v-else-if="props.protocol.startsWith('http')"
        >
          <div
            v-for="value in [props.traffic.http?.[`${props.direction}_rq_1xx`] as (number | undefined) ?? 0].filter(item => item !== 0)"
            :key="value"
            data-testid="rq-1xx"
          >
            <dt>{{ t('data-planes.components.service_traffic_card.1xx') }}</dt>
            <dd>{{ t('common.formats.integer', { value: value }) }}</dd>
          </div>
          <div
            data-testid="rq-2xx"
          >
            <dt>{{ t('data-planes.components.service_traffic_card.2xx') }}</dt>
            <dd>{{ t('common.formats.integer', { value: props.traffic.http?.[`${props.direction}_rq_2xx`] }) }}</dd>
          </div>
          <div
            v-for="value in [props.traffic.http?.[`${props.direction}_rq_3xx`] as (number | undefined) ?? 0].filter(item => item !== 0)"
            :key="value"
            data-testid="rq-3xx"
          >
            <dt>{{ t('data-planes.components.service_traffic_card.3xx') }}</dt>
            <dd>{{ t('common.formats.integer', { value: value }) }}</dd>
          </div>
          <div
            data-testid="rq-4xx"
          >
            <dt>{{ t('data-planes.components.service_traffic_card.4xx') }}</dt>
            <dd>{{ t('common.formats.integer', { value: props.traffic.http?.[`${props.direction}_rq_4xx`] }) }}</dd>
          </div>
          <div
            data-testid="rq-5xx"
          >
            <dt>{{ t('data-planes.components.service_traffic_card.5xx') }}</dt>
            <dd>{{ t('common.formats.integer', { value: props.traffic.http?.[`${props.direction}_rq_5xx`] }) }}</dd>
          </div>
        </template>
        <template
          v-else
        >
          <div
            data-testid="connections-total"
          >
            <dt>{{ t('data-planes.components.service_traffic_card.cx') }}</dt>
            <dd>{{ t('common.formats.integer', { value: props.traffic.tcp?.[`${props.direction}_cx_total`] }) }}</dd>
          </div>
          <div
            v-if="typeof props.traffic.tcp?.[`${props.direction}_cx_tx_bytes_total`] !== 'undefined'"
            data-testid="bytes-received"
          >
            <dt>{{ t('data-planes.components.service_traffic_card.rx') }}</dt>
            <dd>{{ formatBytes(props.traffic.tcp?.[`${props.direction}_cx_tx_bytes_total`]) }}</dd>
          </div>
          <div
            v-if="typeof props.traffic.tcp?.[`${props.direction}_cx_rx_bytes_total`] !== 'undefined'"
            data-testid="bytes-sent"
          >
            <dt>{{ t('data-planes.components.service_traffic_card.tx') }}</dt>
            <dd>{{ formatBytes(props.traffic.tcp?.[`${props.direction}_cx_rx_bytes_total`]) }}</dd>
          </div>
        </template>
      </dl>
    </template>
    <template v-else>
      <XProgress
        variant="line"
      />
    </template>
  </DataCard>
</template>
<script lang="ts" setup>
import formatBytes from 'pretty-bytes'

import { useI18n } from '@/app/application'
import DataCard from '@/app/common/data-card/DataCard.vue'
import TagList from '@/app/common/TagList.vue'
const { t } = useI18n()
const props = withDefaults(defineProps<{
  protocol: string
  service?: string
  traffic?: Record<string, any>
  direction?: 'upstream' | 'downstream'
  portName?: string
}>(), {
  service: '',
  traffic: undefined,
  direction: 'downstream',
  portName: undefined,
})
const click = (e: MouseEvent) => {
  const $target = e.target as HTMLElement
  if (e.isTrusted && $target.nodeName.toLowerCase() !== 'a') {
    const $el = $target.closest('.service-traffic-card, a')
    if ($el) {
      const $a = $el.nodeName.toLowerCase() === 'a' ? $el : $el.querySelector('[data-action]')
      if ($a !== null && 'click' in $a && typeof $a.click === 'function') {
        $a.click()
      }
    }
  }
}

</script>
<style lang="scss" scoped>
.tag-list {
  float: right;
  margin-bottom: $kui-space-40;
  margin-left: $kui-space-40;
}
.title {
  float: left;
  font-size: $kui-font-size-40;
  display: flex;
  flex: 1 1 auto;
  gap: $kui-space-40;
}
.protocol {
  align-self: start;
}
.title :deep(> a) {
  text-decoration: none;
  color: inherit;
}
</style>
