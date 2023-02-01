<template>
  <img
    src="@/assets/images/product-logo.png"
    :alt="`${env('KUMA_PRODUCT_NAME')} Logo`"
  >
</template>

<script lang="ts" setup>
import { useEnv } from '@/utilities'
const env = useEnv()
</script>

<style lang="scss" scoped>
img {
  max-height: 36px;
}
</style>
