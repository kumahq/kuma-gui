<template>
  <div class="py-4">
    <p class="mb-4">
      {{ productName }} is presenting a simple solution to aggregate the
      logs of your containers and the access logs of your data-planes.
    </p>

    <p class="mb-4">
      {{ productName }} natively integrates with <a
        href="https://github.com/grafana/loki"
        target="_blank"
      >Loki</a>. To install it you can run
      <Tabs :tabs="tabs">
        <template v-slot:kubernetes>
          <code class="block">kumactl install logging | kubectl apply -f -</code>
          to get up and running quickly. Running this will deploy Loki automatically in a
          <code class="inline">kuma-logging</code>.
        </template>

        <template v-slot:universal>
          <code class="block">
            <pre>
type: Mesh
name: default
logging:
  defaultBackend: file
  backends:
    - name: logstash
      format: '{"start_time": "%START_TIME%", "source": "%KUMA_SOURCE_SERVICE%", "destination": "%KUMA_DESTINATION_SERVICE%", "source_address": "%KUMA_SOURCE_ADDRESS_WITHOUT_PORT%", "destination_address": "%UPSTREAM_HOST%", "duration_millis": "%DURATION%", "bytes_received": "%BYTES_RECEIVED%", "bytes_sent": "%BYTES_SENT%"}'
      type: tcp
      conf:
        address: 127.0.0.1:5000
    - name: file
      type: file
      conf:
        path: /tmp/access.log</pre>
          </code>
          We can apply the configuration with
          <code class="inline">kubectl apply -f [..]</code>.
        </template>
      </Tabs>
    </p>
    <KButton
      :to="`https://kuma.io/docs/${version}/policies/traffic-log/`"
      target="_blank"
      appearance="outline-primary"
    >
      Learn More
    </KButton>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Tabs from '@/components/Utils/Tabs.vue'
import { PRODUCT_NAME } from '@/consts'
export default {
  name: 'LoggingNotification',
  components: { Tabs },
  data() {
    return {
      productName: PRODUCT_NAME,
      tabs: [
        {
          hash: '#universal',
          title: 'Universal',
        },
        {
          hash: '#kubernetes',
          title: 'Kubernetes',
        },
      ],
    }
  },
  computed: {
    ...mapGetters({
      version: 'config/getVersion',
    }),
  },
}
</script>

Kuma
