<template>
  <ServicesView
    route-name="internal-services"
    name="Internal Services"
    :tab-headers="tabHeaders"
  />
</template>
<script>
import ServicesView from '@/views/Entities/partial/ServicesView.vue'

export default {
  name: 'InternalServices',

  components: {
    ServicesView,
  },

  data() {
    return {
      tabHeaders: [
        { key: 'actions', hideLabel: true },
        { label: 'Status', key: 'status' },
        { label: 'Name', key: 'name' },
        { label: 'Mesh', key: 'mesh' },
        { label: 'Data plane proxies: Online / Total', key: 'totalOnline' },
      ],
    }
  },
}
</script>
