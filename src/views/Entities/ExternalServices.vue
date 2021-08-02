<template>
  <Services
    route-name="external-services"
    name="External Services"
    :tab-headers="tabHeaders"
  />
</template>
<script>

import Services from '@/views/Entities/partial/Services.vue'

export default {
  name: 'ExternalServices',
  metaInfo: {
    title: 'External Services'
  },
  components: {
    Services,
  },
  data () {
    return {
      tabHeaders: [
        { key: 'actions', hideLabel: true },
        { label: 'Name', key: 'name' },
        { label: 'Mesh', key: 'mesh' },
        { label: 'Address', key: 'address' },
        { label: 'TLS', key: 'tlsEnabled' }
      ]
    }
  }
}
</script>
