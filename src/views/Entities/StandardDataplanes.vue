<template>
  <div class="standard-dataplanes">
    <DataplanesView
      :dataplane-api-params="{ gateway: false }"
      empty-state-msg="There are no Standard data plane proxies present."
    />
  </div>
</template>

<script>
import DataplanesView from '@/views/Entities/partial/DataplanesView.vue'

export default {
  name: 'StandardDataplanes',
  metaInfo: {
    title: 'Standard Data plane proxies',
  },
  components: {
    DataplanesView,
  },
}
</script>
