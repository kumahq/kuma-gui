<template>
  <XActionGroup>
    <template #control>
      <XAction
        action="expand"
        appearance="primary"
      >
        {{ t("main-overview.action_menu.toggle_button") }}
      </XAction>
    </template>

    <slot name="actions" />
  </XActionGroup>
</template>

<script setup lang="ts">
import { useI18n } from '@/app/application'

const { t } = useI18n()
</script>
