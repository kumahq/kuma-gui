<template>
  <img
    src="@/assets/images/product-logo.png"
    :alt="`${t('common.product.name')} Logo`"
  >
</template>

<script lang="ts" setup>
import { useI18n } from '@/utilities'
const { t } = useI18n()
</script>

<style lang="scss" scoped>
img {
  max-height: 36px;
}
</style>
