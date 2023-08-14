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
            {{ t('common.product.name') }} update available
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
import { KAlert, KButton } from '@kong/kongponents'
import { ref } from 'vue'

import { useEnv, useKumaApi, useI18n } from '@/utilities'

const kumaApi = useKumaApi()
const env = useEnv()
const { t } = useI18n()

const latestVersion = ref('')
const showNotice = ref(false)

checkVersion(env('KUMA_VERSION'))

// mostly taken from semver-compare
const compare = (a: string, b: string) => {
  const pa = a.split('.')
  const pb = b.split('.')
  for (let i = 0; i < 3; i++) {
    const na = Number(pa[i])
    const nb = Number(pb[i])
    if (na > nb) return 1
    if (nb > na) return -1
  }
  return 0
}

async function checkVersion(currentVersion: string): Promise<void> {
  if (!currentVersion.match('^[0-9]+.[0-9]+.[0-9]+$')) {
    return
  }

  try {
    latestVersion.value = await kumaApi.getLatestVersion()
  } catch (error) {
    console.error(error)
    return
  }
  if (latestVersion.value !== '') {
    // compare the latest version to the currently running version
    // but only if we were able to set the latest version in the first place.
    const comparison = compare(latestVersion.value, currentVersion)
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
</script>

<style lang="scss" scoped>
.upgrade-check-alert.k-alert.small {
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

.warning-button {
  --KButtonPrimaryBase: #f2a230;
  --KButtonPrimaryHover: #f2a230;
  --KButtonPrimaryActive: #f2a230;
}
</style>
