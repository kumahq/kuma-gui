# ServiceTraffic

Component for displaying `inbounds` or `outbounds`.

<script lang="ts" setup>
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { ForwardIcon, GatewayIcon } from '@kong/icons'
import ServiceTraffic from '@/app/services/components/service-traffic/ServiceTraffic.vue'
import ServiceTrafficCard from '@/app/services/components/service-traffic/ServiceTrafficCard.vue'
import ServiceTrafficGroup from '@/app/services/components/service-traffic/ServiceTrafficGroup.vue'
</script>

<iframe
  height="800"
  data-why
  title="service-traffic"
>
  <ServiceTraffic>
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
      <ServiceTrafficCard
        :protocol="`grpc`"
        :total="1000"
        :success="982"
      >
        backend demo
      </ServiceTrafficCard>
      <ServiceTrafficCard
        :protocol="`http2`"
        :total="1000"
        :success="982"
      >
        backend demo
      </ServiceTrafficCard>
    </ServiceTrafficGroup>
  </ServiceTraffic>
<p>---</p>
  <ServiceTraffic>
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
      <ServiceTrafficCard
        :protocol="`unknown`"
        :total="1000"
        :success="982"
      >
        Non mesh traffic
      </ServiceTrafficCard>
    </ServiceTrafficGroup>
    <ServiceTrafficGroup
      type="outbound"
    >
      <ServiceTrafficCard
        :protocol="`grpc`"
        :total="1000"
        :success="982"
      >
        backend demo
      </ServiceTrafficCard>
      <ServiceTrafficCard
        :protocol="`http2`"
        :total="1000"
        :success="982"
      >
        backend demo
      </ServiceTrafficCard>
    </ServiceTrafficGroup>
  </ServiceTraffic>
</iframe>
