<template>
  <RouteView
    name="builtin-gateway-detail-view"
    :params="{
      mesh: '',
      gateway: '',
      listener: '0',
    }"
    v-slot="{ route }"
  >
    <AppView>
      <DataSource
        :src="`/meshes/${route.params.mesh}/mesh-gateways/${route.params.gateway}`"
        v-slot="{ data: meshGateway, error: meshGatewayError }: MeshGatewaySource"
      >
        <DataSource
          :src="`/policy-types`"
          v-slot="{ data: policyTypesData, error: policyTypesError }: PolicyTypeCollectionSource"
        >
          <DataLoader
            :src="`/meshes/${route.params.mesh}/mesh-gateways/${route.params.gateway}/rules`"
            :data="[meshGateway, policyTypesData]"
            :errors="[meshGatewayError, policyTypesError]"
            v-slot="{ data: rulesData }: GatewayRulesSource"
          >
            <template v-if="meshGateway && rulesData && policyTypesData">
              <ListenerRoutes
                :mesh-gateway="meshGateway"
                :selected-listener-index="Number(route.params.listener)"
                :policy-types-by-name="policyTypesData.policies.reduce((obj, policyType) => Object.assign(obj, { [policyType.name]: policyType }), {})"
                :inspect-rules="rulesData.rules"
              />
            </template>
          </DataLoader>
        </DataSource>
      </DataSource>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import ListenerRoutes from '../components/ListenerRoutes.vue'
import type { GatewayRulesSource, MeshGatewaySource } from '../sources'
import type { PolicyTypeCollectionSource } from '@/app/policies/sources'
</script>
