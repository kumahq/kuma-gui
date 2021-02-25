<template>
  <span>
    There is mismatch between versions of Kuma DP (<strong>{{ payload.kumaDpVersion }}</strong>)
    and the Zone CP (<strong>{{ payload.zoneVersion }}</strong>)
  </span>
</template>

<script>
export default {
  name: 'WarningZoneAndKumaDPVersionsIncompatible',
  props: {
    payload: {
      type: Object,
      required: true,
    },
  },
}
</script>
