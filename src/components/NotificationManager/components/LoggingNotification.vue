<template>
  <div class="py-4">
    <p class="mb-4">
      A traffic log policy lets you collect access logs for every data plane proxy in your service mesh.
    </p>

    <ul class="list-disc pl-4">
      <li>
        <a
          :href="`https://kuma.io/docs/${kumaDocsVersion}/policies/traffic-log/`"
          target="_blank"
        >
          Traffic Log policy documentation
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'LoggingNotification',
  computed: {
    ...mapGetters({
      kumaDocsVersion: 'config/getKumaDocsVersion',
    }),
  },
}
</script>
