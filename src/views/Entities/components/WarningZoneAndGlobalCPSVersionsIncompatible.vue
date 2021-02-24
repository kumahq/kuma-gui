<template>
  <span>
    There is mismatch between versions of Zone CP (<strong>{{ payload.zoneCpVersion }}</strong>)
    and the Global CP (<strong>{{ payload.globalCpVersion }}</strong>)
  </span>
</template>

<script>
export default {
  name: 'WarningZoneAndGlobalCPSVersionsIncompatible',
  props: {
    payload: {
      type: Object,
      required: true,
    },
  },
}
</script>
