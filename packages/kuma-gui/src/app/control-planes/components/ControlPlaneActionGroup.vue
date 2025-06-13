<template>
  <XLayout
    type="separated"
    justify="end"
  >
    <slot />
    <XActionGroup>
      <template #control>
        <XAction
          action="expand"
          appearance="primary"
        >
          {{ t("main-overview.action_menu.toggle_button") }}
        </XAction>
      </template>
      <XAction :to="{ name: 'hostname-generator-root-view' }">
        {{ t("main-overview.action_menu.items.hostname_generators") }}
      </XAction>

      <slot name="actions" />
    </XActionGroup>
  </XLayout>
</template>

<script setup lang="ts">
import { useI18n } from '@/app/application'

const { t } = useI18n()
</script>
