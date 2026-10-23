<template>
  <RouteView
    name="kuma-kri-view"
    :params="{
      kri: '',
    }"
    v-slot="{ route }"
  >
    <template
      v-for="href in [protocolHandler(`kri://${route.params.kri}`)]"
      :key="typeof href"
    >
      <template
        v-if="href.length > 0"
      >
        <div
          @vue:mounted="() => push(href)"
        />
      </template>
      <component :is="KumaNotFoundView" />
    </template>
  </RouteView>
</template>
<script lang="ts" setup>
import { useProtocolHandler, usePush } from '@kumahq/x'

import KumaNotFoundView from './KumaNotFoundView.vue'

const protocolHandler = useProtocolHandler()
const push = usePush()
</script>
