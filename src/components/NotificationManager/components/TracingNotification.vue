<template>
  <div class="py-4">
    <p class="mb-4">
      A traffic trace policy lets you enable tracing logs and a third-party tracing solution to send them to.
    </p>

    <ul class="list-disc pl-4">
      <li>
        <a
          :href="`https://kuma.io/docs/${version}/policies/traffic-trace/`"
          target="_blank"
        >
          Traffic Trace policy documentation
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'TracingNotification',

  computed: {
    ...mapGetters({
      version: 'config/getVersion',
    }),
  },
}
</script>
