<template>
  <DataSource
    v-slot="{ data }"
    :src="`/control-plane/version/latest`"
  >
    <KAlert
      v-if="env('KUMA_VERSION') !== data?.version"
      data-testid="upgrade-check"
      class="upgrade-check-alert"
      appearance="info"
      size="small"
    >
      <template #alertMessage>
        <div class="alert-content">
          <div>
            {{ t('common.product.name') }} update available
          </div>

          <div>
            <KButton
              appearance="primary"
              :to="t('common.product.href.install')"
            >
              Update
            </KButton>
          </div>
        </div>
      </template>
    </KAlert>
  </DataSource>
</template>

<script lang="ts" setup>
import { useEnv, useI18n } from '@/utilities'
const env = useEnv()
const { t } = useI18n()
</script>

<style lang="scss" scoped>
.k-alert.small {
  // Uses smaller paddings for this particular alert.
  padding: $kui-space-20 $kui-space-40;
}

.alert-content {
  display: flex;
  align-items: center;
  font-size: $kui-font-size-30;

  > *:first-of-type {
    margin-right: $kui-space-50;
  }
}
</style>
