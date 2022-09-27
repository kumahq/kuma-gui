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
          :href="`https://kuma.io/docs/${kumaDocsVersion}/security/certificates/`"
          target="_blank"
        >
          Secure access across services
        </a>
      </li>
      <li>
        <a
          :href="`https://kuma.io/docs/${kumaDocsVersion}/policies/mutual-tls/`"
          target="_blank"
        >
          Mutual TLS
        </a>
      </li>
      <li>
        <a
          :href="`https://kuma.io/docs/${kumaDocsVersion}/policies/traffic-permissions/`"
          target="_blank"
        >
          Traffic Permissions policy documentation
        </a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useStore } from '@/store/store'

const store = useStore()

const kumaDocsVersion = computed(() => store.getters['config/getKumaDocsVersion'])
</script>
