<template>
  <ServiceList
    type="ExternalService"
    :tab-headers="tabHeaders"
  />
</template>

<script lang="ts" setup>
import ServiceList from '../components/ServiceList.vue'

const tabHeaders = [
  { label: 'Actions', key: 'actions', hideLabel: true },
  { label: 'Name', key: 'name' },
  { label: 'Mesh', key: 'mesh' },
  { label: 'Address', key: 'address' },
  { label: 'TLS', key: 'tlsEnabled' },
]
</script>
