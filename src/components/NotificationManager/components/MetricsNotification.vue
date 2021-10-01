<template>
  <div class="py-4">
    <p class="mb-4">
      Observability will give you a better understanding of service behavior
      to increase development teams’ reliability and efficiency.
    </p>

    <p class="mb-4">
      {{ productName }} natively integrates with <a
        href="https://prometheus.io/docs/visualization/grafana/"
        target="_blank"
      >Prometheus</a> for auto-service discovery and traffic metrics
      collection. We also integrate with Grafana dashboards for performance monitoring. You can install your own
      Prometheus and Grafana, or you can run
      <Tabs :tabs="tabs">
        <template v-slot:kubernetes>
          <code class="block">kumactl install metrics | kubectl apply -f -</code>
          to get up and running quickly. Running this will install Prometheus and Grafana in a new namespace called
          <code class="inline">kuma-metrics</code>.
        </template>

        <template v-slot:universal>
          <code class="block">
            <pre>
type: Mesh
name: default
metrics:
  enabledBackend: prometheus-1
  backends:
  - name: prometheus-1
    type: prometheus
    conf:
      skipMTLS: true </pre>
          </code>
        </template>
      </Tabs>
    </p>
    <p class="mb-4">
      If you want to use Splunk, Logstash or any other system, Kuma supports
      those as well.
    </p>
    <KButton
      :to="`https://kuma.io/docs/${version}/policies/traffic-metrics/`"
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
  name: 'MetricsNotification',
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
