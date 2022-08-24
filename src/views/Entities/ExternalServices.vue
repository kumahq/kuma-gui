<template>
  <ServicesView
    route-name="external-services"
    name="External Services"
    :tab-headers="tabHeaders"
  />
</template>
<script>
import ServicesView from '@/views/Entities/partial/ServicesView.vue'

export default {
  name: 'ExternalServices',

  components: {
    ServicesView,
  },

  data() {
    return {
      tabHeaders: [
        { key: 'actions', hideLabel: true },
        { label: 'Name', key: 'name' },
        { label: 'Mesh', key: 'mesh' },
        { label: 'Address', key: 'address' },
        { label: 'TLS', key: 'tlsEnabled' },
      ],
    }
  },
}
</script>
