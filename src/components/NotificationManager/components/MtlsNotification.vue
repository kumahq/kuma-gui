<template>
  <div class="py-4">
    <p class="mb-4">
      Zero-trust security becomes even more critical as you transition to a microservice architecture.
      Microservices can be a chance to make your systems more secure than they were with monolithic applications.
      To do so, you use a zero-trust security model to encrypt traffic and reduce the risk of breaches,
      including mTLS and traffic permissions ACL to secure traffic paths from one service to another
    </p>

    <p class="mb-4">
      {{ productName }} is one service mesh that you can deploy once across any zone, cloud or cluster,
      including a Kubernetes cluster. Then, on top of this one service mesh implementation, you can create as many
      virtual service meshes as you want—each backed by its certificate authority.
    </p>
    <div class="mb-4">
      <p class="mb-2">
        This is the fastest and simplest way to enable mTLS in {{ productName }}.
      </p>
      <p class="mb-2">
        With a <code class="inline">builtin</code> CA backend type, {{ productName }} will dynamically generate its own
        CA root certificate and key that it uses to automatically provision (and rotate) certificates for every replica
        of every service.
      </p>
      <p class="mb-2">
        We can specify more than one <code class="inline">builtin</code> backend with different names, and each one of
        them will be automatically provisioned with a unique pair of certificate + key (they are not shared).
      </p>
      <p class="mb-2">
        To enable a <code class="inline">builtin</code> mTLS for the entire Mesh we can apply the
        following configuration:
      </p>

      <Tabs :tabs="tabs">
        <template v-slot:kubernetes>
          <code class="block">
            <pre>
apiVersion: kuma.io/v1alpha1
kind: Mesh
metadata:
  name: default
spec:
  mtls:
    enabledBackend: ca-1
    backends:
      - name: ca-1
        type: builtin
        dpCert:
          rotation:
            expiration: 1d
        conf:
          caCert:
            RSAbits: 2048
            expiration: 10y</pre>
          </code>
          We can apply the configuration with
          <code class="inline">kubectl apply -f [..]</code>.
        </template>

        <template v-slot:universal>
          <code class="block">
            <pre>
type: Mesh
name: default
mtls:
  enabledBackend: ca-1
  backends:
    - name: ca-1
      type: builtin
      dpCert:
        rotation:
          expiration: 1d
      conf:
        caCert:
          RSAbits: 2048
          expiration: 10y</pre>
          </code>
          We can apply the configuration with
          <code class="inline">kumactl apply -f [..]</code>.
        </template>
      </Tabs>
    </div>

    <KButton
      :to="`https://kuma.io/docs/${version}/policies/mutual-tls/`"
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
  name: 'MtlsNotification',
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
