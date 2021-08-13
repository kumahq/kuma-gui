<template>
  <div class="dataplanes">
    <Dataplanes />
  </div>
</template>

<script>
import Dataplanes from '@/views/Entities/partial/Dataplanes'

export default {
  name: 'AllDataplanes',
  metaInfo: {
    title: 'Data plane proxies',
  },
  components: {
    Dataplanes,
  },
}
</script>
