<template>
  <div class="app-setup-demo">
    <h4 class="lg mb-4">
      Try with a Demo App instead
    </h4>
    <p class="lg light-text mb-4">
      If you don’t have an application ready for {{ productName }}, you can deploy a Demo App.
      This can be removed later from the settings page.
    </p>
    <p>
      <a
        href="#"
        class="arrow-link"
      >
        Deploy Demo App
      </a>
    </p>
  </div>
</template>

<script>
import { PRODUCT_NAME } from '@/consts'
export default {
  data() {
    return {
      productName: PRODUCT_NAME,
    }
  },
}
</script>

<style lang="scss">
.app-setup-demo {
  .light-text {
    color: var(--tblack-45);
  }
}
</style>
