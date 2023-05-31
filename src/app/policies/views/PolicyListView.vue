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
          :selected-entity-name="currentEntityName ?? undefined"
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

      <PolicyDetails
        v-if="currentEntityName !== null"
        :name="currentEntityName"
        :mesh="currentMeshName"
        :path="policyType.path"
        :type="policyType.name"
      />
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

import PolicyDetails from '../components/PolicyDetails.vue'
import DataOverview from '@/app/common/DataOverview.vue'
import DocumentationLink from '@/app/common/DocumentationLink.vue'
import { PAGE_SIZE_DEFAULT } from '@/constants'
import { useStore } from '@/store/store'
import { PolicyEntity, TableHeader } from '@/types/index.d'
import { useEnv, useKumaApi } from '@/utilities'
import { QueryParameter } from '@/utilities/QueryParameter'

type PolicyEntityTableRow = {
  entity: PolicyEntity
  detailViewRoute: RouteLocationNamedRaw
  type: string
}

const env = useEnv()
const kumaApi = useKumaApi()
const route = useRoute()
const router = useRouter()
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
const nextUrl = ref<string | null>(null)
const pageOffset = ref(props.offset)
const currentEntityName = ref<string | null>(props.selectedPolicyName)

const tableData = ref<{ headers: TableHeader[], data: PolicyEntityTableRow[] }>({
  headers: [
    { label: 'Name', key: 'entity' },
    { label: 'Type', key: 'type' },
  ],
  data: [],
})

const currentMeshName = computed(() => route.params.mesh as string)
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

async function start() {
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
    loadEntity({ name: props.selectedPolicyName ?? tableData.value.data[0]?.entity.name })
  } catch (err) {
    tableData.value.data = []

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

function handleTableAction(entity: PolicyEntity) {
  loadEntity({ name: entity.name })
}

function loadEntity({ name }: { name?: string | undefined }) {
  currentEntityName.value = name ?? null
  QueryParameter.set('policy', name ?? null)
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
  font-weight: var(--font-weight-regular);
}
</style>
