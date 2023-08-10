<template>
  <div
    v-if="alertClosed === false"
    class="onboarding-check"
  >
    <KAlert
      appearance="success"
      dismiss-type="icon"
      @closed="closeAlert"
    >
      <template #alertMessage>
        <div class="alert-content">
          <div>
            <strong>Welcome to {{ t('common.product.name') }}!</strong> We've detected that you don't have any data plane proxies running yet. We've created an onboarding process to help you!
          </div>

          <div>
            <KButton
              appearance="primary"
              size="small"
              class="action-button"
              :to="{ name: 'onboarding-welcome' }"
            >
              Get started
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

import { useI18n } from '@/utilities'

const { t } = useI18n()
const alertClosed = ref(false)

function closeAlert() {
  alertClosed.value = true
}
</script>

<style lang="scss" scoped>
.onboarding-check {
  margin: 0 0 var(--spacing-xl) 0;
}

.alert-content {
  @media screen and (min-width: 700px) {
    display: flex;
    align-items: center;

    > *:first-of-type {
      margin-right: var(--spacing-md);
    }

    > *:last-of-type {
      min-width: 150px;
    }
  }

  @media screen and (max-width: 699px) {
    > *:last-of-type {
      margin-top: 10px;
    }
  }
}

.action-button.action-button {
  text-decoration: none;
}
</style>
