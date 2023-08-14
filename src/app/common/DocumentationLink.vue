<template>
  <a
    class="docs-link"
    :href="props.href"
    target="_blank"
  >
    <KIcon
      icon="book"
      color="currentColor"
      :size="KUI_ICON_SIZE_30"
      :title="t('common.documentation')"
    />

    <span class="visually-hidden">{{ t('common.documentation') }}</span>
  </a>
</template>

<script lang="ts" setup>
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'

import { useI18n } from '@/utilities'

const { t } = useI18n()

const props = defineProps({
  href: {
    type: String,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
.docs-link {
  display: inline-flex;
  align-items: center;
  padding-right: $kui-space-40;
  padding-left: $kui-space-40;
}
</style>
