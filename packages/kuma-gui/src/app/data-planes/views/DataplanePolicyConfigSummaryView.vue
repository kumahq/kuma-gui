<template>
  <RouteView
    name="data-plane-policy-config-summary-view"
    :params="{
      inactive: Boolean,
      proxyType: '',
      connection: '',
      policy: '',
    }"
    v-slot="{ route, uri }"
  >
    <DataSource
      :src="uri(resourceSources, '/resource-type-descriptors', {})"
      v-slot="{ data: sourceResources }"
    >
      <DataLoader
        :data="[props.policies, sourceResources]"
        v-slot="{ data: [policiesData, resourcesData]}"
      >
        <DataCollection
          :items="resourcesData.resources"
          :predicate="(resource) => typeof resource.policy !== 'undefined'"
          v-slot="{ items: policyTypesData }"
        >
          <DataCollection
            :items="Object.entries(Object.groupBy(policiesData, ({ kind }) => kind ))"
            :predicate="([item]) => item.toLocaleLowerCase() === route.params.policy"
            v-slot="{ items }"
          >
            <template
              v-for="[kind, configs] of items"
              :key="kind"
            >
              <AppView>
                <template #title>
                  <XLayout
                    variant="y-stack"
                    size="small"
                  >
                    <h2
                      v-icon-start="{name: kind, size: '60', default: 'policy'}"
                    >
                      {{ kind }}
                    </h2>
                  </XLayout>
                </template>
                <template
                  v-for="(config, index) in configs"
                  :key="index"
                >
                  <template
                    v-for="policyTypes in [Object.groupBy(policyTypesData, ({ name }) => name)]"
                    :key="`${typeof policyTypes}`"
                  >
                    <XTable
                      v-if="config.origins.length > 0"
                      variant="kv"
                    >
                      <tr>
                        <th scope="row">
                          Origin policies
                        </th>
                        <td>
                          <ul>
                            <li
                              v-for="origin in config.origins"
                              :key="origin.kri"
                            >
                              <template
                                v-for="kri in [Kri.fromString(origin.kri)]"
                                :key="typeof kri"
                              >
                                <XAction
                                  v-if="policyTypes[kind]"
                                  :to="{
                                    name: 'policy-detail-view',
                                    params: {
                                      mesh: kri.mesh,
                                      policyPath: policyTypes[kind]![0].path,
                                      policy: origin.kri,
                                    },
                                  }"
                                >
                                  {{ origin.kri }}
                                </XAction>
                                <template
                                  v-else
                                >
                                  {{ origin.kri }}
                                </template>
                              </template>
                            </li>
                          </ul>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2">
                          <XLayout
                            variant="y-stack"
                            size="small"
                          >
                            <span>Config</span>
                            <XCodeBlock
                              :code="YAML.stringify(config.conf)"
                              language="yaml"
                              :show-copy-button="false"
                            />
                          </XLayout>
                        </td>
                      </tr>
                    </XTable>
                  </template>
                </template>
              </AppView>
            </template>
          </DataCollection>
        </DataCollection>
      </DataLoader>
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>
import { YAML } from '@/app/application'
import { Kri } from '@/app/kuma'
import type { DataplanePolicies } from '@/app/policies/data/DataplanePolicies'
import { sources as resourceSources } from '@/app/resources/sources'

const props = defineProps<{
  policies?: DataplanePolicies['policies']
}>()
</script>
<style scoped>
h2::before {
  display: none !important;
}
</style>
