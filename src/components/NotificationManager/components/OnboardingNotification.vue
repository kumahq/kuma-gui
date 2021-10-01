<template>
  <div class="onboarding-check">
    <KAlert appearance="success">
      <template v-slot:alertMessage>
        <div class="flex justify-between items-center">
          <div class="w-4/5">
            <strong>Welcome to {{ productName }}!</strong> We've detected that you don't have
            any data plane proxies running yet. We've created an onboarding process to
            help you!
          </div>
          <div class="w-1/5">
            <KButton
              appearance="outline-primary"
              size="small"
              class="action-button"
              :to="{ path: '/get-started' }"
            >
              Get Started
            </KButton>
          </div>
        </div>
      </template>
    </KAlert>
  </div>
</template>

<script>
import { PRODUCT_NAME } from '@/consts'

export default {
  name: 'OnboardingNotification',
  data() {
    return {
      alertClosed: false,
      productName: PRODUCT_NAME,
    }
  },
  methods: {
    closeAlert() {
      this.alertClosed = true
    },
  },
}
</script>

<style lang="scss" scoped>
.onboarding-check {
  margin: 0 0 var(--spacing-xl) 0;
}

.action-button.action-button {
  text-decoration: none;
}
</style>
