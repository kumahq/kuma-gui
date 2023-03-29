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
          :selected-entity-name="entity.name"
          :page-size="PAGE_SIZE_DEFAULT"
          :error="error"
          :is-loading="isLoading"
          :empty-state="{
            title: 'No Data',
            message: `There are no ${policyType.name} policies present.`,
          }"
          :table-data="tableData"
          :table-data-is-empty="tableDataIsEmpty"
          :next="nextUrl"
          :page-offset="pageOffset"
          @table-action="getEntity"
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

            <KButton
              v-if="$route.query.ns"
              class="back-button"
              appearance="primary"
              icon="arrowLeft"
              :to="{ name: 'policy', params: { policyPath: props.policyPath } }"
            >
              View all
            </KButton>
          </template>
        </DataOverview>
      </div>

      <div class="kcard-border">
        <TabsWidget
          v-if="isEmpty === false"
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
            <LabelList
              :has-error="entityHasError"
              :is-loading="entityIsLoading"
              :is-empty="entityIsEmpty"
            >
              <div data-testid="policy-overview-tab">
                <ul>
                  <li
                    v-for="(val, key) in entity"
                    :key="key"
                  >
                    <h4>{{ key }}</h4>
                    <p>
                      {{ val }}
                    </p>
                  </li>
                </ul>
              </div>
            </LabelList>

            <YamlView
              v-if="rawEntity !== null"
              id="code-block-policy"
              class="mt-4"
              :has-error="entityHasError"
              :is-loading="entityIsLoading"
              :is-empty="entityIsEmpty"
              :content="rawEntity"
              is-searchable
            />
          </template>

          <template #affected-dpps>
            <PolicyConnections
              v-if="rawEntity !== null"
              :mesh="rawEntity.mesh"
              :policy-name="rawEntity.name"
              :policy-type="policyType.path"
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
  KButton,
  KSelect,
} from '@kong/kongponents'
import { computed, ref, watch } from 'vue'
import { RouteLocationNamedRaw, useRoute, useRouter } from 'vue-router'

import PolicyConnections from '../components/PolicyConnections.vue'
import DataOverview from '@/app/common/DataOverview.vue'
import DocumentationLink from '@/app/common/DocumentationLink.vue'
import LabelList from '@/app/common/LabelList.vue'
import TabsWidget from '@/app/common/TabsWidget.vue'
import YamlView from '@/app/common/YamlView.vue'
import { PAGE_SIZE_DEFAULT } from '@/constants'
import { useStore } from '@/store/store'
import { PolicyEntity, TableHeader } from '@/types/index.d'
import { useEnv, useKumaApi } from '@/utilities'
import { getSome, stripTimes } from '@/utilities/helpers'
import { QueryParameter } from '@/utilities/QueryParameter'
import type { SelectItem } from '@kong/kongponents/dist/types/components/KSelect/KSelect.vue.d'

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
    type: String,
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
const isEmpty = ref(false)
const error = ref<Error | null>(null)
const entityIsLoading = ref(true)
const entityIsEmpty = ref(false)
const entityHasError = ref(false)
const tableDataIsEmpty = ref(false)
const entity = ref<any>({})
const rawEntity = ref<Omit<PolicyEntity, 'creationTime' | 'modificationTime'> | null>(null)
const nextUrl = ref<string | null>(null)
const pageOffset = ref(props.offset)

const tableData = ref<{ headers: TableHeader[], data: any[] }>({
  headers: [
    { label: 'Name', key: 'name' },
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

  // Ensures basic state is reset when switching meshes using the mesh selector.
  isLoading.value = true
  isEmpty.value = false
  entityIsLoading.value = true
  entityIsEmpty.value = false
  entityHasError.value = false
  tableDataIsEmpty.value = false
  error.value = null

  loadData(0)
})
watch(() => route.query.ns, function () {
  isLoading.value = true
  isEmpty.value = false
  entityIsLoading.value = true
  entityIsEmpty.value = false
  entityHasError.value = false
  tableDataIsEmpty.value = false
  error.value = null

  loadData(0)
})

loadData(props.offset)

async function loadData(offset: number): Promise<void> {
  pageOffset.value = offset
  // Puts the offset parameter in the URL so it can be retrieved when the user reloads the page.
  QueryParameter.set('offset', offset > 0 ? offset : null)

  isLoading.value = true
  error.value = null

  const name = route.query.ns as string || null
  const mesh = route.params.mesh as string
  const path = policyType.value.path

  try {
    let items: PolicyEntity[]

    if (mesh !== null && name !== null) {
      const item = await kumaApi.getSinglePolicyEntity({ mesh, path, name })
      items = [item]
      nextUrl.value = null
    } else {
      const params = {
        size: PAGE_SIZE_DEFAULT,
        offset,
      }
      const response = await kumaApi.getAllPolicyEntitiesFromMesh({ mesh, path }, params)
      items = response.items ?? []
      nextUrl.value = response.next
    }

    // set table data
    if (items.length > 0) {
      tableData.value.data = items.map((entity) => processEntity(entity))
      tableDataIsEmpty.value = false
      isEmpty.value = false

      const selectedPolicyName = props.selectedPolicyName ?? items[0].name

      await getEntity({ name: selectedPolicyName, mesh, path })
    } else {
      tableData.value.data = []
      tableDataIsEmpty.value = true
      isEmpty.value = true
      entityIsEmpty.value = true
    }
  } catch (err) {
    if (err instanceof Error) {
      error.value = err
    } else {
      console.error(err)
    }

    isEmpty.value = true
  } finally {
    isLoading.value = false
    entityIsLoading.value = false
  }
}

function changePolicyType(item: {value: string}) {
  router.push({
    name: 'policy',
    params: {
      ...route.params,
      policyPath: item.value,
    },
  })
}

function processEntity(entity: PolicyEntity): any {
  if (!entity.mesh) {
    return entity
  }

  const processedEntity: any = entity

  const meshRoute: RouteLocationNamedRaw = {
    name: 'mesh-detail-view',
    params: {
      mesh: entity.mesh,
    },
  }
  processedEntity.meshRoute = meshRoute

  return processedEntity
}

async function getEntity(selectedEntity: { mesh: string, path: string, name: string }): Promise<void> {
  entityHasError.value = false
  entityIsLoading.value = true
  entityIsEmpty.value = false

  try {
    const item = await kumaApi.getSinglePolicyEntity({ mesh: selectedEntity.mesh, path: policyType.value.path, name: selectedEntity.name })

    if (item) {
      const selected = ['type', 'name', 'mesh']

      entity.value = getSome(item, selected)
      QueryParameter.set('policy', entity.value.name)
      rawEntity.value = stripTimes(item)
    } else {
      entity.value = {}
      entityIsEmpty.value = true
    }
  } catch (err) {
    entityHasError.value = true
    console.error(err)
  } finally {
    entityIsLoading.value = false
  }
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
