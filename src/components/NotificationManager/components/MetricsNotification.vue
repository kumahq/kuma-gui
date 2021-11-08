<template>
  <div class="py-4">
    <p class="mb-4">
      A traffic metrics policy lets you collect key data for observability of your service mesh.
    </p>

    <ul class="list-disc pl-4">
      <li>
        <a
          :href="`https://kuma.io/docs/${version}/policies/traffic-metrics/`"
          target="_blank"
        >
          Traffic Metrics policy documentation
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'MetricsNotification',
  computed: {
    ...mapGetters({
      version: 'config/getVersion',
    }),
  },
}
</script>
