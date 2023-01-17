<template>
  <div class="py-4">
    <p class="mb-4">
      A traffic trace policy lets you enable tracing logs and a third-party tracing solution to send them to.
    </p>

    <ul class="list-disc pl-4">
      <li>
        <a
          :href="`${env('KUMA_DOCS_URL')}/policies/traffic-trace/?${env('KUMA_UTM_QUERY_PARAMS')}`"
          target="_blank"
        >
          Traffic Trace policy documentation
        </a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { useEnv } from '@/utilities'
const env = useEnv()
</script>
