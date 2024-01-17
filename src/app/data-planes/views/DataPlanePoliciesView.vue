<template>
  <RouteView
    v-slot="{ can, route, t }"
    name="data-plane-policies-view"
    :params="{
      mesh: '',
      dataPlane: '',
    }"
  >
    <AppView>
      <template #title>
        <h2>
          <RouteTitle
            :title="t('data-planes.routes.item.navigation.data-plane-policies-view')"
          />
        </h2>
      </template>

      <DataSource
        v-slot="{ data: policyTypesData, error: policyTypesError }: PolicyTypeCollectionSource"
        :src="`/*/policy-types`"
      >
        <DataSource
          v-slot="{ data: sidecarDataplaneData, error }: SidecarDataplaneCollectionSource"
          :src="!can('use zones') && props.data.dataplaneType !== 'builtin' ? `/meshes/${route.params.mesh}/dataplanes/${route.params.dataPlane}/sidecar-dataplane-policies` : ''"
        >
          <DataSource
            v-slot="{ data: gatewayDataplane, error: gatewayDataplaneError }: MeshGatewayDataplaneSource"
            :src="!can('use zones') && props.data.dataplaneType === 'builtin' ? `/meshes/${route.params.mesh}/dataplanes/${route.params.dataPlane}/gateway-dataplane-policies` : ''"
          >
            <DataSource
              v-slot="{ data: rulesData, error: rulesError }: DataplaneRulesSource"
              :src="`/meshes/${route.params.mesh}/dataplanes/${route.params.dataPlane}/rules`"
            >
              <ErrorBlock
                v-if="policyTypesError"
                :error="policyTypesError"
              />

              <ErrorBlock
                v-else-if="error"
                :error="error"
              />

              <ErrorBlock
                v-else-if="gatewayDataplaneError"
                :error="gatewayDataplaneError"
              />

              <ErrorBlock
                v-else-if="rulesError"
                :error="rulesError"
              />

              <!-- The conditions here have gotten a bit unwieldy due to us only showing "Legacy policies" in zone mode and so we only query the corresponding APIs in zone mode, too. Therefore, the conditions for both the loading and empty block have to take this into account. We’re eventually getting rid of the /meshes/:mesh/dataplanes/:dataplane/policies endpoint which will simplify matters again. -->
              <LoadingBlock
                v-else-if="
                  policyTypesData === undefined ||
                    rulesData === undefined ||
                    (!can('use zones') && props.data.dataplaneType !== 'builtin' && sidecarDataplaneData === undefined) ||
                    (!can('use zones') && props.data.dataplaneType === 'builtin' && gatewayDataplane === undefined)
                "
              />

              <EmptyBlock
                v-else-if="
                  (!can('use zones') ? (sidecarDataplaneData?.policyTypeEntries ?? []).length === 0 || gatewayDataplane === undefined : true) &&
                    rulesData.rules.length === 0
                "
              />

              <StandardDataplanePolicies
                v-else
                :policy-types-by-name="policyTypesData.policies.reduce((obj, policyType) => Object.assign(obj, { [policyType.name]: policyType }), {})"
                :policy-type-entries="sidecarDataplaneData?.policyTypeEntries ?? []"
                :gateway-dataplane="gatewayDataplane"
                :inspect-rules-for-dataplane="rulesData"
                :show-legacy-policies="!can('use zones')"
              />
            </DataSource>
          </DataSource>
        </DataSource>
      </DataSource>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import StandardDataplanePolicies from '../components/StandardDataplanePolicies.vue'
import type { DataplaneOverview } from '../data'
import type { DataplaneRulesSource, MeshGatewayDataplaneSource, SidecarDataplaneCollectionSource } from '../sources'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import type { PolicyTypeCollectionSource } from '@/app/policies/sources'

const props = defineProps<{
  data: DataplaneOverview
}>()
</script>
