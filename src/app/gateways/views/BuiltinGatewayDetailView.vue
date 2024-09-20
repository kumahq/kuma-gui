<template>
  <RouteView
    name="builtin-gateway-detail-view"
    :params="{
      mesh: '',
      gateway: '',
      listener: '0',
    }"
    v-slot="{ route, uri }"
  >
    <AppView>
      <DataSource
        :src="uri(policySources, '/policy-types', {})"
        v-slot="{ data, error }"
      >
        <DataSource
          :src="uri(sources, '/meshes/:mesh/mesh-gateways/:name/rules', {
            mesh: route.params.mesh,
            name: route.params.gateway,
          })"
          v-slot="{ data: rules, error: rulesError }"
        >
          <DataLoader
            :data="[data, rules]"
            :errors="[error, rulesError]"
          >
            <template v-if="rules && data">
              <ListenerRoutes
                :mesh-gateway="props.gateway"
                :selected-listener-index="Number(route.params.listener)"
                :policy-types-by-name="data.policies.reduce((obj, policyType) => Object.assign(obj, { [policyType.name]: policyType }), {})"
                :inspect-rules="rules.rules"
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
import type { MeshGateway } from '../data'
import { sources } from '../sources'
import { sources as policySources } from '@/app/policies/sources'
const props = defineProps<{
  gateway: MeshGateway
}>()
</script>
