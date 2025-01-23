<template>
  <DataSource
    :src="`/me/-onboarding-alert`"
    v-slot="{ data, refresh }"
  >
    <DataSink
      :src="`/me/-onboarding-alert`"
      v-slot="{ submit }"
    >
      <XAlert
        v-if="data?.closed !== true"
        variant="success"
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
          <XI18n
            path="main-overview.detail.onboarding.message"
            :params="{
              name: t('common.product.name'),
            }"
          />

          <XAction
            appearance="primary"
            size="small"
            class="action-button"
            :to="{ name: 'onboarding-welcome-view' }"
          >
            {{ t('main-overview.detail.onboarding.get_started_link') }}
          </XAction>
        </div>
      </XAlert>
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
