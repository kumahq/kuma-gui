<template>
  <div class="py-4">
    <p class="mb-4">
      Injecting distributed tracing into each of your services will enable you to monitor and
      troubleshoot microservice behavior without introducing any dependencies to the existing application code.
    </p>

    <p class="mb-4">
      To capture traces between Kong and your applications, you can use Kuma’s Traffic Trace policy.
      {{ productName }} provides a native
      <a
        target="_blank"
        href="https://www.jaegertracing.io/"
      >
        Jaeger
      </a> and
      <a
        target="_blank"
        href="https://zipkin.io/"
      >
        Zipkin
      </a> integration so you can run

      <Tabs :tabs="tabs">
        <template v-slot:kubernetes>
          <code class="block">kumactl install tracing | kubectl apply -f -</code>
          This provides a helper that creates Zipkin and Jaeger automatically in a new namespace called
          <code class="inline">kuma-tracing</code>.
        </template>

        <template v-slot:universal>
          <code class="block">
            <pre>
type: Mesh
name: default
tracing:
  defaultBackend: jaeger-collector
  backends:
  - name: jaeger-collector
    type: zipkin
    sampling: 100.0
    conf:
      url: http://jaeger-collector.kuma-tracing:9411/api/v2/spans</pre>
          </code>
        </template>
      </Tabs>
    </p>

    <p class="mb-4">
      Also you can integrate it with
      <a
        target="_blank"
        href="https://docs.datadoghq.com/tracing/"
      >
        Datadog
      </a>.
    </p>

    <KButton
      :to="`https://kuma.io/docs/${version}/policies/traffic-trace/`"
      target="_blank"
      appearance="outline-primary"
    >
      Learn More
    </KButton>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { PRODUCT_NAME } from '@/consts'
import Tabs from '@/components/Utils/Tabs.vue'
export default {
  name: 'TracingNotification',
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
