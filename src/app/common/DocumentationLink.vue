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

    <span><slot>{{ t('common.documentation') }}</slot></span>
  </a>
</template>

<script lang="ts" setup>
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'

import { useI18n } from '@/utilities'

const { t } = useI18n()

const props = defineProps<{
  href: string
}>()
</script>

<style lang="scss" scoped>
.docs-link {
  display: inline-flex;
  align-items: flex-end;
  gap: $kui-space-20;
  padding-right: $kui-space-40;
  padding-left: $kui-space-40;
}
</style>
