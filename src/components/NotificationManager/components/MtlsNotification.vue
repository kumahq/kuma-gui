<template>
  <div class="py-4">
    <p class="mb-4">
      Mutual TLS (mTLS) for communication between all the components
      of your service mesh (services, control plane, data plane proxies), proxy authentication,
      and access control rules in Traffic Permissions policies all contribute to securing your mesh.
    </p>

    <ul class="list-disc pl-4">
      <li>
        <a
          :href="`https://kuma.io/docs/${version}/security/certificates/`"
          target="_blank"
        >
          Secure access across services
        </a>
      </li>
      <li>
        <a
          :href="`https://kuma.io/docs/${version}/policies/mutual-tls/`"
          target="_blank"
        >
          Mutual TLS
        </a>
      </li>
      <li>
        <a
          :href="`https://kuma.io/docs/${version}/policies/traffic-permissions/`"
          target="_blank"
        >
          Traffic Permissions policy documentation
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'MtlsNotification',

  computed: {
    ...mapGetters({
      version: 'config/getVersion',
    }),
  },
}
</script>
