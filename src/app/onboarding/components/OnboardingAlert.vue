<template>
  <DataSource
    v-slot="{ data, refresh }"
    :src="`/me/-onboarding-alert`"
  >
    <DataSink
      v-slot="{ submit }"
      :src="`/me/-onboarding-alert`"
    >
      <KAlert
        v-if="data?.closed !== true"
        appearance="success"
        dismissible
        data-testid="onboarding-notification"
        @dismiss="async () => {
          submit({
            closed: true,
          })
          await nextTick()
          refresh()
        }"
      >
        <div class="onboarding-alert-content">
          <div
            v-html="t('main-overview.detail.onboarding.message', { name: t('common.product.name') })"
          />

          <KButton
            appearance="primary"
            size="small"
            class="action-button"
            :to="{ name: 'onboarding-welcome-view' }"
          >
            {{ t('main-overview.detail.onboarding.get_started_link') }}
          </KButton>
        </div>
      </KAlert>
    </DataSink>
  </DataSource>
</template>

<script lang="ts" setup>
import { nextTick } from 'vue'

import { useI18n } from '@/app/application'
const { t } = useI18n()
</script>

<style lang="scss" scoped>
.onboarding-alert-content {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: $kui-space-60;
}
</style>
