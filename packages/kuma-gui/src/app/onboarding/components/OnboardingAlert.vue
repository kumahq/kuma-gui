<template>
  <XNotification
    variant="success"
    uri="onboarding"
  >
    <XLayout
      type="separated"
    >
      <XI18n
        v-slot="{ t }"
      >
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
      </XI18n>
    </XLayout>
  </XNotification>
</template>
