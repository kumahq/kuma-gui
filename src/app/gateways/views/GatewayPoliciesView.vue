<template>
  <RouteView
    v-slot="{ route }"
    name="gateway-policies-view"
    data-testid="gateway-policies-view"
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
import { KCard } from '@kong/kongponents'

import GatewayDataplanePolicyList from '../components/GatewayDataplanePolicyList.vue'
import { MeshGatewayDataplaneSource } from '../sources'
import AppView from '@/app/application/components/app-view/AppView.vue'
import DataSource from '@/app/application/components/data-source/DataSource.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import { PolicyTypeCollectionSource } from '@/app/policies/sources'
import { useI18n } from '@/utilities'

const { t } = useI18n()
</script>
