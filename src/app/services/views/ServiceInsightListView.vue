<template>
  <ServiceList
    type="ServiceInsight"
    :tab-headers="tabHeaders"
  />
</template>

<script lang="ts" setup>
import ServiceList from '../components/ServiceList.vue'

const tabHeaders = [
  { label: 'Actions', key: 'actions', hideLabel: true },
  { label: 'Status', key: 'status' },
  { label: 'Name', key: 'name' },
  { label: 'Mesh', key: 'mesh' },
  { label: 'Data plane proxies: Online / Total', key: 'totalOnline' },
]
</script>
