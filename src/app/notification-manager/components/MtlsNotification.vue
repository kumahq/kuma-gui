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
          :href="`${env('KUMA_DOCS_URL')}/security/certificates/?${env('KUMA_UTM_QUERY_PARAMS')}`"
          target="_blank"
        >
          Secure access across services
        </a>
      </li>
      <li>
        <a
          :href="`${env('KUMA_DOCS_URL')}/policies/mutual-tls/?${env('KUMA_UTM_QUERY_PARAMS')}`"
          target="_blank"
        >
          Mutual TLS
        </a>
      </li>
      <li>
        <a
          :href="`${env('KUMA_DOCS_URL')}/policies/traffic-permissions/?${env('KUMA_UTM_QUERY_PARAMS')}`"
          target="_blank"
        >
          Traffic Permissions policy documentation
        </a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { useEnv } from '@/utilities'
const env = useEnv()
</script>
