<template>
  <Services
    route-name="internal-services"
    name="Internal Services"
    :tab-headers="tabHeaders"
  />
</template>
<script>
import Services from '@/views/Entities/partial/Services.vue'

export default {
  name: 'InternalServices',
  metaInfo: {
    title: 'Internal Services',
  },
  components: {
    Services,
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
