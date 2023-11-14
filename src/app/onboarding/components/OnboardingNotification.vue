<template>
  <!-- As well as only showing the notification on the homepage -->
  <!-- We also share the same datasource URL as the mesh listing on the homepage -->
  <DataSource
    v-if="route.name === 'home'"
    v-slot="{ data }"
    :src="`/meshes?page=1&size=10`"
  >
    <template
      v-if="data?.items.length === 1 && data.items[0].name === 'default'"
    >
      <template
        v-if="data.items[0].dataplanes.total === 0"
      >
        <div
          v-if="alertClosed === false"
          class="onboarding-check"
          data-testid="onboarding-notification"
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
    </template>
  </DataSource>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import { useI18n } from '@/utilities'

const { t } = useI18n()
const route = useRoute()
const alertClosed = ref(false)

function closeAlert() {
  alertClosed.value = true
}
</script>

<style lang="scss" scoped>
.onboarding-check {
  margin: 0 0 $kui-space-90 0;
}

.alert-content {
  @media screen and (min-width: 700px) {
    display: flex;
    align-items: center;

    > *:first-of-type {
      margin-right: $kui-space-60;
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
