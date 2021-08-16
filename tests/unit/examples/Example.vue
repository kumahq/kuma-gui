<template>
  <div>
    {{ msg }}

    <span>{{ msg2 }}</span>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'HelloWorld',
  props: {
    msg: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    msg2: '',
  }),

  async mounted() {
    const response = await axios('/zones')

    this.msg2 = response.data.total
  },
}
</script>
