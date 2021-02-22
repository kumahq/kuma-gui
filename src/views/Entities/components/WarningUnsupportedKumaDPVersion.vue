<template>
  <span>
    Unsupported version of Kuma DP (<strong>{{ payload.kumaDpVersion }}</strong>)
  </span>
</template>

<script>
export default {
  name: 'WarningUnsupportedKumaDPVersion',
  props: {
    payload: {
      type: Object,
      required: true,
    },
  },
}
</script>
