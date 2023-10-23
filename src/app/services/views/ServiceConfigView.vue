<template>
  <RouteView
    v-slot="{ route, t }"
    name="service-config-view"
    :params="{
      mesh: '',
      service: '',
    }"
  >
    <AppView>
      <template #title>
        <h2>
          <RouteTitle
            :title="t('services.routes.item.navigation.service-config-view')"
            :render="true"
          />
        </h2>
      </template>

      <KCard>
        <template #body>
          <ExternalServiceConfig
            :mesh="route.params.mesh"
            :service="route.params.service"
          />
        </template>
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import ExternalServiceConfig from '../components/ExternalServiceConfig.vue'
</script>
