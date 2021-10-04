<template>
  <div class="py-4">
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
      productName: PRODUCT_NAME,
    }
  },
}
</script>

<style lang="scss" scoped>
.action-button.action-button {
  text-decoration: none;
}
</style>
