<template>
  <span>
    {{ payload }}
  </span>
</template>

<script>
export default {
  name: 'WarningDefault',
  props: {
    payload: {
      type: [String, Object],
      required: true,
    },
  },
}
</script>
