<template>
  <div class="upgrade-check">
    <KAlert
      v-if="showNotice"
      class="upgrade-check-alert"
      appearance="warning"
      size="small"
    >
      <template #alertMessage>
        <div class="alert-content">
          <div>
            {{ env('KUMA_PRODUCT_NAME') }} update available
          </div>

          <div>
            <KButton
              class="warning-button"
              appearance="primary"
              size="small"
              :to="env('KUMA_INSTALL_URL')"
            >
              Update
            </KButton>
          </div>
        </div>
      </template>
    </KAlert>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import compare from 'semver/functions/compare'
import { KAlert, KButton } from '@kong/kongponents'

import { useEnv, useKumaApi } from '@/utilities'

const kumaApi = useKumaApi()
const env = useEnv()

const latestVersion = ref('')
const showNotice = ref(false)

checkVersion()

async function checkVersion(): Promise<void> {
  try {
    latestVersion.value = await kumaApi.getLatestVersion()
  } catch (error) {
    showNotice.value = false

    console.error(error)
  } finally {
    if (latestVersion.value !== '') {
      // compare the latest version to the currently running version
      // but only if we were able to set the latest version in the first place.
      const comparison = compare(latestVersion.value, env('KUMA_VERSION'))
      showNotice.value = comparison === 1
    } else {
      const timespan = 3 // months
      const today = new Date()
      const refDate = new Date('2020-06-03 12:00:00')
      const later = new Date(refDate.getFullYear(), refDate.getMonth() + timespan, refDate.getDate())

      // compare dates and handle the notice accordingly
      showNotice.value = today.getTime() >= later.getTime()
    }
  }
}
</script>

<style lang="scss" scoped>
.upgrade-check-alert.k-alert.small {
  // Uses smaller paddings for this particular alert.
  padding: var(--spacing-xxs) var(--spacing-xs);
}

.alert-content {
  display: flex;
  align-items: center;
  font-size: var(--type-sm);

  > *:first-of-type {
    margin-right: var(--spacing-sm);
  }
}

.warning-button {
  --KButtonPrimaryBase: #f2a230;
  --KButtonPrimaryHover: #f2a230;
  --KButtonPrimaryActive: #f2a230;
}
</style>
