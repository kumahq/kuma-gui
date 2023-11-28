# DataPlaneTraffic

Component for displaying `inbounds` or `outbounds`.

<script lang="ts" setup>
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { ForwardIcon, GatewayIcon } from '@kong/icons'
import DataPlaneTraffic from './DataPlaneTraffic.vue'
import ServiceTrafficCard from './ServiceTrafficCard.vue'
import ServiceTrafficGroup from './ServiceTrafficGroup.vue'
</script>

<iframe
  height="800"
  data-why
  title="data-plane-traffic"
>
  <DataSource
    v-slot="{data}"
    :src="`/meshes/default/dataplanes/a-dataplane/traffic`"
  >
    <template
      v-if="data"
    >
      <DataPlaneTraffic>
        <template #title>
          <ForwardIcon
            display="inline-block"
            decorative
            :size="KUI_ICON_SIZE_30"
          />
          Inbounds
        </template>
        <template #data>
          <dl>
            <div>
              <dt>{{ t('services.components.service_traffic.inbound', {}, {defaultMessage: 'Requests'}) }}</dt>
              <dd>{{ t('common.formats.integer', {value: 1000}) }}</dd>
            </div>
          </dl>
        </template>
        <ServiceTrafficGroup
          type="inbound"
        >
          <template
            v-for="item in data.inbounds"
            :key="`${item.name}`"
          >
            <template
              v-for="meta in [
                {
                  protocol: typeof item.http !== 'undefined' ? 'http' : 'tcp',
                  direction: 'downstream',
                },
              ]"
              :key="meta.protocol"
            >
              <ServiceTrafficCard
                :protocol="meta.protocol"
                :tx="item[meta.protocol]?.[`${meta.direction}_cx_tx_bytes_total`]"
                :rx="item[meta.protocol]?.[`${meta.direction}_cx_rx_bytes_total`]"
                :requests="meta.protocol === 'http' ? ['http1_total', 'http2_total', 'http3_total'].reduce((prev, key) => prev + (item.http[`${meta.direction}_rq_${key}`] ?? 0), 0) : undefined"
              >
                {{ item.name }}
              </ServiceTrafficCard>
            </template>
          </template>
        </ServiceTrafficGroup>
      </DataPlaneTraffic>
    <p>---</p>
      <DataPlaneTraffic>
        <template #title>
          <GatewayIcon
            display="inline-block"
            decorative
            :size="KUI_ICON_SIZE_30"
          />
          <span>Outbounds</span>
        </template>
        <template #data>
          <dl>
            <div>
              <dt class="passthrough">
                {{ t('services.components.service_traffic.passthrough', {}, {defaultMessage: 'Passthrough Requests'}) }}
              </dt>
              <dd>{{ t('common.formats.integer', {value: 1000}) }}</dd>
            </div>
            <div>
              <dt class="outbounds">
                {{ t('services.components.service_traffic.mesh', {}, {defaultMessage: 'Mesh Requests'}) }}
              </dt>
              <dd>{{ t('common.formats.integer', {value: 1000}) }}</dd>
            </div>
          </dl>
        </template>
        <ServiceTrafficGroup
          type="passthrough"
        >
          <template
            v-for="meta in [
              {
                protocol: 'cluster',
                direction: 'downstream',
              },
            ]"
            :key="meta.protocol"
          >
            <ServiceTrafficCard
              :protocol="`unknown`"
              :tx="data.passthrough.reduce((prev: number, item: any) => prev + (item[meta.protocol]?.[`${meta.direction}_cx_tx_bytes_total`] ?? 0), 0)"
              :rx="data.passthrough.reduce((prev: number, item: any) => prev + (item[meta.protocol]?.[`${meta.direction}_cx_rx_bytes_total`] ?? 0), 0)"
            >
              Non mesh traffic
            </ServiceTrafficCard>
          </template>
        </ServiceTrafficGroup>
        <ServiceTrafficGroup
          type="outbound"
        >
          <template
            v-for="item in data.outbounds"
            :key="`${item.name}`"
          >
            <template
              v-for="meta in [
                {
                  protocol: typeof item.http !== 'undefined' ? 'http' : 'tcp',
                  direction: 'downstream',
                },
              ]"
              :key="meta.protocol"
            >
              <ServiceTrafficCard
                :protocol="meta.protocol"
                :tx="item[meta.protocol]?.[`${meta.direction}_cx_tx_bytes_total`]"
                :rx="item[meta.protocol]?.[`${meta.direction}_cx_rx_bytes_total`]"
                :requests="meta.protocol === 'http' ? ['http1_total', 'http2_total', 'http3_total'].reduce((prev, key) => prev + (item.http[`${meta.direction}_rq_${key}`] ?? 0), 0) : undefined"
              >
                {{ item.name }}
              </ServiceTrafficCard>
            </template>
          </template>
        </ServiceTrafficGroup>
      </DataPlaneTraffic>
    </template>
  </DataSource>
</iframe>
