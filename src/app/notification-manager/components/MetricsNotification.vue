<template>
  <div class="py-4">
    <p class="mb-4">
      A traffic metrics policy lets you collect key data for observability of your service mesh.
    </p>

    <ul class="list-disc pl-4">
      <li>
        <a
          :href="`${env('KUMA_DOCS_URL')}/policies/traffic-metrics/?${env('KUMA_UTM_QUERY_PARAMS')}`"
          target="_blank"
        >
          Traffic Metrics policy documentation
        </a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { useEnv } from '@/utilities/useEnv'
const env = useEnv()
</script>
