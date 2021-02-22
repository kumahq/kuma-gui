<template>
  <div>
    <div>
      Couldn't parse API response with supported versions
    </div>
    <div v-if="error">
      <code>{{ error }}</code>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'WarningWrongFormat',
  computed: {
    ...mapGetters({
      error: 'getSupportedVersionsFailed',
    })
  }
}
</script>
