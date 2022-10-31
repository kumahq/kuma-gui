<template>
  <div class="upgrade-check">
    <KAlert
      v-if="showNotice"
      appearance="warning"
      size="small"
    >
      <template #alertMessage>
        <div class="alert-content">
          <div>
            {{ tagline }} update available
          </div>

          <div>
            <KButton
              class="warning-button"
              appearance="primary"
              size="small"
              :to="URL"
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
import { computed, ref } from 'vue'
import compare from 'semver-compare'
import { KAlert, KButton } from '@kong/kongponents'

import { kumaApi } from '@/api/kumaApi'
import { useStore } from '@/store/store'

const URL = `${import.meta.env.VITE_INSTALL_URL}${import.meta.env.VITE_UTM}`

const store = useStore()

const latestVersion = ref('')
const showNotice = ref(false)

const currentVersion = computed(() => store.getters['config/getVersion'])
const tagline = computed(() => store.getters['config/getTagline'])

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
      const comparison = compare(latestVersion.value, currentVersion.value || '')

      if (comparison === 1) {
        showNotice.value = true
      } else {
        showNotice.value = false
      }
    } else {
      const timespan = 3 // months
      const today = new Date()
      const refDate = new Date('2020-06-03 12:00:00')
      const later = new Date(refDate.getFullYear(), refDate.getMonth() + timespan, refDate.getDate())

      // compare dates and handle the notice accordingly
      if (today.getTime() >= later.getTime()) {
        showNotice.value = true
      } else {
        showNotice.value = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.upgrade-check {
  .k-alert.k-alert {
    padding: var(--spacing-xxs) var(--spacing-xs);
  }
}

.alert-content {
  display: flex;
  align-items: center;
  font-size: var(--type-sm);

  > *:first-of-type {
    margin-right: var(--spacing-sm);
  }

  .k-button {
    text-decoration: none;

    &:after {
      display: none;
    }
  }
}

.warning-button {
  --KButtonPrimaryBase: #f2a230;
  --KButtonPrimaryHover: #f2a230;
  --KButtonPrimaryActive: #f2a230;
}
</style>
