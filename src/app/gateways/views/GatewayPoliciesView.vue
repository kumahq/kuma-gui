<template>
  <RouteView
    v-slot="{ route, t }"
    name="gateway-policies-view"
    :params="{
      mesh: '',
      dataPlane: ''
    }"
  >
    <AppView>
      <template #title>
        <h2>
          <RouteTitle
            :title="t('gateways.routes.item.navigation.gateway-policies-view')"
            :render="true"
          />
        </h2>
      </template>

      <KCard>
        <template #body>
          <DataSource
            v-slot="{ data: policyTypesData, error: policyTypesError }: PolicyTypeCollectionSource"
            :src="`/*/policy-types`"
          >
            <DataSource
              v-slot="{ data, error }: MeshGatewayDataplaneSource"
              :src="`/meshes/${route.params.mesh}/gateways/${route.params.dataPlane}/policies`"
            >
              <ErrorBlock
                v-if="policyTypesError"
                :error="policyTypesError"
              />

              <ErrorBlock
                v-else-if="error"
                :error="error"
              />

              <LoadingBlock v-else-if="data === undefined || policyTypesData === undefined" />

              <GatewayDataplanePolicyList
                v-else
                :policy-types-by-name="policyTypesData.policies.reduce((obj, policyType) => Object.assign(obj, { [policyType.name]: policyType }), {})"
                :gateway-dataplane="data"
              />
            </DataSource>
          </DataSource>
        </template>
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import GatewayDataplanePolicyList from '../components/GatewayDataplanePolicyList.vue'
import { MeshGatewayDataplaneSource } from '../sources'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import { PolicyTypeCollectionSource } from '@/app/policies/sources'
</script>
