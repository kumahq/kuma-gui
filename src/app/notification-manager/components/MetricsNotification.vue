<template>
  <div class="py-4">
    <p class="mb-4">
      A traffic metrics policy lets you collect key data for observability of your service mesh.
    </p>

    <ul class="list-disc pl-4">
      <li>
        <a
          :href="`https://kuma.io/docs/${kumaDocsVersion}/policies/traffic-metrics/`"
          target="_blank"
        >
          Traffic Metrics policy documentation
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
