<template>
  <div class="standard-dataplanes">
    <Dataplanes
      :dataplane-api-params="{ gateway: false, ingress: false }"
      empty-state-msg="There are no Standard data plane proxies present."
    />
  </div>
</template>

<script>
import Dataplanes from '@/views/Entities/partial/Dataplanes'

export default {
  name: 'StandardDataplanes',
  metaInfo: {
    title: 'Standard Data plane proxies'
  },
  components: {
    Dataplanes,
  }
}
</script>
