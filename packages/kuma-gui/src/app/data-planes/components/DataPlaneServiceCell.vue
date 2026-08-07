<template>
  <XLayout
    v-if="services.length > 0"
    variant="separated"
    truncate
  >
    <div
      v-for="(service, index) in services"
      :key="index"
    >
      <XCopyButton :text="service">
        <XAction
          v-if="dataplaneType === 'delegated'"
          :to="{
            name: 'delegated-gateway-detail-view',
            params: {
              service,
            },
          }"
        >
          {{ service }}
        </XAction>

        <template v-else>
          {{ service }}
        </template>
      </XCopyButton>
    </div>
  </XLayout>

  <template v-else>
    {{ t('common.collection.none') }}
  </template>
</template>

<script lang="ts" setup>
import { useI18n } from '@/app/application'

defineProps<{
  services: string[]
  dataplaneType: string
}>()

const { t } = useI18n()
</script>
