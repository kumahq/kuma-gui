<template>
  <div class="ingress-dataplanes">
    <Dataplanes v-bind="$data" />
  </div>
</template>

<script>
import Dataplanes from '@/views/Entities/partial/Dataplanes'

export default {
  name: 'IngressDataplanes',
  metaInfo: {
    title: 'Ingress Data plane proxies'
  },
  components: {
    Dataplanes,
  },
  data () {
    return {
      tableHeaders: [
        { key: 'actions', hideLabel: true },
        { label: 'Status', key: 'status' },
        { label: 'Name', key: 'name' },
        { label: 'Type', key: 'type' },
        { label: 'Tags', key: 'tags' },
        { label: 'Public address', key: 'publicAddress' },
        { label: 'Public port', key: 'publicPort' },
        { label: 'Last Connected', key: 'lastConnected' },
        { label: 'Last Updated', key: 'lastUpdated' },
        { label: 'Total Updates', key: 'totalUpdates' },
        { label: 'Kuma DP version', key: 'dpVersion' },
        { label: 'Envoy version', key: 'envoyVersion' },
        { key: 'warnings', hideLabel: true },
      ],
      tabs: [
        {
          hash: '#overview',
          title: 'Overview'
        },
        {
          hash: '#yaml',
          title: 'YAML'
        },
        {
          hash: '#warnings',
          title: 'Warnings'
        },
      ],
      showMtls: false,
      dataplaneApiParams: {
        ingress: true,
      },
      nsBackButtonRoute: {
        name: 'ingress-dataplanes',
      },
      emptyStateMsg: 'There are no Ingress data plane proxies present.',
      getDataplaneType () {
        return 'Ingress'
      },
      addDataFields (dataplane = {}) {
        const { networking = {} } = dataplane
        const { ingress = {} } = networking
        const { publicAddress, publicPort } = ingress

        return { publicAddress, publicPort }
      },
      buildEntity (basicData, tags) {
        return { basicData, tags }
      },
    };
  },
}
</script>
