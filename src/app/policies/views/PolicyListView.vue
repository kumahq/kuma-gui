<template>
  <div
    v-if="policyType"
    class="relative"
    :class="policyType.path"
  >
    <div class="kcard-stack">
      <div class="kcard-border">
        <KCard
          v-if="policyType.isExperimental"
          border-variant="noBorder"
          class="mb-4"
        >
          <template #body>
            <KAlert appearance="warning">
              <template #alertMessage>
                <p>
                  <strong>Warning</strong> This policy is experimental. If you encountered any problem please open an
                  <a
                    href="https://github.com/kumahq/kuma/issues/new/choose"
                    target="_blank"
                    rel="noopener noreferrer"
                  >issue</a>
                </p>
              </template>
            </KAlert>
          </template>
        </KCard>

        <DataOverview
          :selected-entity-name="entity?.name"
          :page-size="PAGE_SIZE_DEFAULT"
          :error="error"
          :is-loading="isLoading"
          :empty-state="{
            title: 'No Data',
            message: `There are no ${policyType.name} policies present.`,
          }"
          :table-data="tableData"
          :table-data-is-empty="tableData.data.length === 0"
          :next="nextUrl"
          :page-offset="pageOffset"
          @table-action="handleTableAction"
          @load-data="loadData"
        >
          >
          <template #additionalControls>
            <KSelect
              label="Policies"
              :items="policySelectItems"
              :label-attributes="{ class: 'visually-hidden' }"
              appearance="select"
              :enable-filtering="true"
              @selected="changePolicyType"
            >
              <template #item-template="{ item }">
                <span
                  :class="{
                    'policy-type-empty': policyTypeNamesWithNoPolicies.includes(item.label)
                  }"
                >
                  {{ item.label }}
                </span>
              </template>
            </KSelect>

            <DocumentationLink
              :href="`${env('KUMA_DOCS_URL')}/policies/${policyType.path}/?${env('KUMA_UTM_QUERY_PARAMS')}`"
              data-testid="policy-documentation-link"
            />
          </template>
        </DataOverview>
      </div>

      <div class="kcard-border">
        <TabsWidget
          v-if="entity !== null"
          :has-error="error !== null"
          :error="error"
          :is-loading="isLoading"
          :tabs="tabs"
        >
          <template #tabHeader>
            <h1
              class="entity-heading"
              data-testid="policy-single-entity"
            >
              {{ policyType.name }}: {{ entity.name }}
            </h1>
          </template>

          <template #overview>
            <DefinitionList data-testid="policy-detail-label-list">
              <DefinitionListItem
                v-for="(value, property) in entity"
                :key="property"
                :term="property"
              >
                {{ value }}
              </DefinitionListItem>
            </DefinitionList>

            <YamlView
              v-if="rawEntity !== null"
              id="code-block-policy"
              class="mt-4"
              :content="rawEntity"
              is-searchable
            />
          </template>

          <template #affected-dpps>
            <PolicyConnections
              v-if="rawEntity !== null"
              :mesh="rawEntity.mesh"
              :policy-name="rawEntity.name"
              :policy-path="policyType.path"
            />
          </template>
        </TabsWidget>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  KAlert,
  KCard,
  KSelect,
  SelectItem,
} from '@kong/kongponents'
import { computed, PropType, ref, watch } from 'vue'
import { RouteLocationNamedRaw, useRoute, useRouter } from 'vue-router'

import PolicyConnections from '../components/PolicyConnections.vue'
import DataOverview from '@/app/common/DataOverview.vue'
import DefinitionList from '@/app/common/DefinitionList.vue'
import DefinitionListItem from '@/app/common/DefinitionListItem.vue'
import DocumentationLink from '@/app/common/DocumentationLink.vue'
import TabsWidget from '@/app/common/TabsWidget.vue'
import YamlView from '@/app/common/YamlView.vue'
import { PAGE_SIZE_DEFAULT } from '@/constants'
import { useStore } from '@/store/store'
import { PolicyEntity, PolicyType, TableHeader } from '@/types/index.d'
import { useEnv, useKumaApi } from '@/utilities'
import { getSome, stripTimes } from '@/utilities/helpers'
import { QueryParameter } from '@/utilities/QueryParameter'

type PolicyEntityTableRow = {
  entity: PolicyEntity
  detailViewRoute: RouteLocationNamedRaw
  type: string
}

const kumaApi = useKumaApi()
const env = useEnv()

const tabs = [
  {
    hash: '#overview',
    title: 'Overview',
  },
  {
    hash: '#affected-dpps',
    title: 'Affected DPPs',
  },
]

const router = useRouter()
const route = useRoute()
const store = useStore()

const props = defineProps({
  selectedPolicyName: {
    type: [String, null] as PropType<string | null>,
    required: false,
    default: null,
  },

  policyPath: {
    type: String,
    required: true,
  },

  offset: {
    type: Number,
    required: false,
    default: 0,
  },
})

const isLoading = ref(true)
const error = ref<Error | null>(null)
const entity = ref<PolicyEntity | null>(null)
const rawEntity = ref<Omit<PolicyEntity, 'creationTime' | 'modificationTime'> | null>(null)
const nextUrl = ref<string | null>(null)
const pageOffset = ref(props.offset)

const tableData = ref<{ headers: TableHeader[], data: PolicyEntityTableRow[] }>({
  headers: [
    { label: 'Name', key: 'entity' },
    { label: 'Type', key: 'type' },
  ],
  data: [],
})

const policyType = computed(() => store.state.policyTypesByPath[props.policyPath])
const policySelectItems = computed<SelectItem[]>(() => {
  return store.state.policyTypes.map((policyType) => ({
    label: policyType.name,
    value: policyType.path,
    selected: policyType.path === props.policyPath,
  }))
})
const policyTypeNamesWithNoPolicies = computed(() => {
  return store.state.policyTypes
    .filter((policyType) => (store.state.sidebar.insights.mesh.policies[policyType.name] ?? 0) === 0)
    .map((policyType) => policyType.name)
})

watch(() => route.params.mesh, function () {
  // Don’t trigger a load when the user is navigating to another route.
  if (route.name !== props.policyPath) {
    return
  }

  loadData(0)
})

start()

function start() {
  const policyType = store.state.policyTypesByPath[props.policyPath]

  if (policyType !== undefined) {
    store.dispatch('updatePageTitle', policyType.name)
  }

  loadData(props.offset)
}

async function loadData(offset: number) {
  pageOffset.value = offset
  // Puts the offset parameter in the URL so it can be retrieved when the user reloads the page.
  QueryParameter.set('offset', offset > 0 ? offset : null)

  isLoading.value = true
  error.value = null

  const mesh = route.params.mesh as string
  const path = route.params.policyPath as string
  const size = PAGE_SIZE_DEFAULT

  try {
    const { items, next } = await kumaApi.getAllPolicyEntitiesFromMesh({ mesh, path }, { size, offset })

    nextUrl.value = next
    tableData.value.data = transformToTableData(items ?? [])
    await loadEntity({ name: props.selectedPolicyName ?? tableData.value.data[0]?.entity.name, mesh, path })
  } catch (err) {
    tableData.value.data = []
    entity.value = null

    if (err instanceof Error) {
      error.value = err
    } else {
      console.error(err)
    }
  } finally {
    isLoading.value = false
  }
}

function transformToTableData(policies: PolicyEntity[]): PolicyEntityTableRow[] {
  return policies.map((entity) => {
    const { type, name } = entity
    const detailViewRoute: RouteLocationNamedRaw = {
      name: 'policy-detail-view',
      params: {
        mesh: entity.mesh,
        policyPath: route.params.policyPath as string,
        policy: name,
      },
    }

    return {
      entity,
      detailViewRoute,
      type,
    }
  })
}

async function handleTableAction(entity: PolicyEntity) {
  const { name, mesh, type } = entity
  const policyType = store.state.policyTypesByName[type] as PolicyType
  const path = policyType.path

  await loadEntity({ name, mesh, path })
}

async function loadEntity({ name, mesh, path }: { name?: string | undefined, mesh: string, path: string }) {
  if (name === undefined) {
    entity.value = null
    rawEntity.value = null
    QueryParameter.set('policy', null)
    return
  }

  try {
    const policy = await kumaApi.getSinglePolicyEntity({ mesh, path, name })

    entity.value = getSome(policy, ['type', 'name', 'mesh'])
    QueryParameter.set('policy', policy.name)
    rawEntity.value = stripTimes(policy)
  } catch (err) {
    console.error(err)
  }
}

function changePolicyType(item: SelectItem) {
  router.push({
    name: 'policies-list-view',
    params: {
      ...route.params,
      policyPath: item.value,
    },
  })
}
</script>

<style lang="scss" scoped>
.policy-type-empty {
  color: var(--grey-400);
}

.entity-heading {
  font-size: inherit;
  font-weight: normal;
}
</style>
