<template>
  <div class="py-4">
    <p class="mb-4">
      A traffic log policy lets you collect access logs for every data plane proxy in your service mesh.
    </p>

    <ul class="list-disc pl-4">
      <li>
        <a
          :href="`${env('KUMA_DOCS_URL')}/policies/traffic-log/?${env('KUMA_UTM_QUERY_PARAMS')}`"
          target="_blank"
        >
          Traffic Log policy documentation
        </a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { useEnv } from '@/utilities'
const env = useEnv()
</script>
