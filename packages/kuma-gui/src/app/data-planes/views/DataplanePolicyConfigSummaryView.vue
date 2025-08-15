<template>
  <RouteView
    name="data-plane-policy-config-summary-view"
    :params="{
      inactive: Boolean,
      proxyType: '',
      connection: '',
      policy: '',
    }"
    v-slot="{ route }"
  >
    <DataCollection
      :items="props.policies"
      :predicate="item => item.kind.toLocaleLowerCase() === route.params.policy"
      v-slot="{ items }"
    >
      <template
        v-for="{ kind, conf, origins } of items"
        :key="kind"
      >
        <AppView>
          <template #title>
            <XLayout size="small">
              <h2>
                <PolicyTypeTag
                  :policy-type="kind"
                >
                  {{ kind }}
                </PolicyTypeTag>
              </h2>
            </XLayout>
          </template>
          <template
            v-for="policyTypes in [Object.groupBy((policyTypesData?.policyTypes ?? []), ({ name }) => name)]"
            :key="`${typeof policyTypes}`"
          >
            <div
              class="stack-with-borders"
            >
              <DefinitionCard
                v-if="origins.length > 0"
                layout="horizontal"
              >
                <template #title>
                  Origin policies
                </template>

                <template #body>
                  <ul>
                    <li
                      v-for="origin in origins"
                      :key="origin.kri"
                    >
                      <template
                        v-for="{ mesh, name } in [Kri.fromString(origin.kri)]"
                        :key="`${mesh}-${name}`"
                      >
                        <XAction
                          v-if="policyTypes[kind]"
                          :to="{
                            name: 'policy-detail-view',
                            params: {
                              mesh: mesh,
                              policyPath: policyTypes[kind]![0].path,
                              policy: name,
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
                </template>
              </DefinitionCard>
              <div>
                <dt>
                  Config
                </dt>
                <dd class="mt-2">
                  <div>
                    <XCodeBlock
                      :code="YAML.stringify(conf)"
                      language="yaml"
                      :show-copy-button="false"
                    />
                  </div>
                </dd>
              </div>
            </div>
          </template>
        </AppView>
      </template>
    </DataCollection>
  </RouteView>
</template>

<script lang="ts" setup>
import { YAML } from '@/app/application'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import PolicyTypeTag from '@/app/common/PolicyTypeTag.vue'
import { Kri } from '@/app/kuma/kri'
import { ResourceCollection } from '@/app/policies/data'
import { DataplanePolicies } from '@/app/policies/data/DataplanePolicies'

const props = defineProps<{
  policies: DataplanePolicies['policies']
  policyTypesData: ResourceCollection
}>()
</script>
<style scoped>
h2::before {
  display: none !important;
}
</style>
