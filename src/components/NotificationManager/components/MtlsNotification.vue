<template>
  <div class="py-4">
    <p class="mb-4">
      MtlsNotification
    </p>

    <KButton
      :to="`https://kuma.io/docs/${version}/policies/mutual-tls/`"
      target="_blank"
      appearance="outline-primary"
    >
      Learn More
    </KButton>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { PRODUCT_NAME } from '@/consts'
export default {
  name: 'MtlsNotification',
  data() {
    return {
      productName: PRODUCT_NAME,
    }
  },
  computed: {
    ...mapGetters({
      version: 'config/getVersion',
    }),
  },
}
</script>
