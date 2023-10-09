<template>
  <RouteView
    name="app-not-found-view"
  >
    <AppView>
      <div class="overview">
        <KEmptyState>
          <template #title>
            <WarningIcon class="mb-3" />
            <h1>
              <RouteTitle
                title="Page Not Found"
                :render="true"
              />
            </h1>
          </template>

          <template #message>
            <p>The page or entity you were looking for does not exist.</p>
          </template>

          <template #cta>
            <KButton
              appearance="primary"
              :to="{ name: 'home' }"
            >
              Go Home
            </KButton>
          </template>
        </KEmptyState>
      </div>
    </AppView>
  </RouteView>
</template>
<script lang="ts" setup>
import WarningIcon from '@/app/common/WarningIcon.vue'
</script>
