<template>
  <div
    v-if="policy"
    class="relative"
    :class="policy.path"
  >
    <div
      v-if="policy.isExperimental"
      class="mb-4"
    >
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
    </div>

    <FrameSkeleton>
      <DataOverview
        :selected-entity-name="entity.name"
        :page-size="PAGE_SIZE_DEFAULT"
        :error="error"
        :is-loading="isLoading"
        :empty-state="{
          title: 'No Data',
          message: `There are no ${policy.pluralDisplayName} present.`,
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
          <KDropdownMenu
            button-appearance="outline"
            :show-caret="true"
            :kpop-attributes="{ placement: 'bottomEnd' }"
            :label="`Type: ${selectedType?.pluralDisplayName}`"
          >
            <template #items>
              <template
                v-for="item in policies"
                :key="item.path"
              >
                <KDropdownItem
                  @click="changePolicyType(item)"
                >
                  {{ item.pluralDisplayName }}
                </KDropdownItem>
              </template>
            </template>
          </KDropdownMenu>
          <DocumentationLink
            :href="docsURL"
            data-testid="policy-documentation-link"
          />

          <KButton
            v-if="$route.query.ns"
            class="back-button"
            appearance="primary"
            icon="arrowLeft"
            :to="{ name: policy.path }"
          >
            View all
          </KButton>
        </template>
      </DataOverview>

      <TabsWidget
        v-if="isEmpty === false"
        :has-error="error !== null"
        :error="error"
        :is-loading="isLoading"
        :tabs="tabs"
        initial-tab-override="overview"
      >
        <template #tabHeader>
          <div>
            <h1 data-testid="policy-single-entity">
              {{ policy.singularDisplayName }}: {{ entity.name }}
            </h1>
          </div>
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

          <div class="config-wrapper">
            <YamlView
              v-if="rawEntity !== null"
              id="code-block-policy"
              :has-error="entityHasError"
              :is-loading="entityIsLoading"
              :is-empty="entityIsEmpty"
              :content="rawEntity"
              is-searchable
            />
          </div>
        </template>

        <template #affected-dpps>
          <PolicyConnections
            v-if="rawEntity !== null"
            :mesh="rawEntity.mesh"
            :policy-name="rawEntity.name"
            :policy-type="policy.path"
          />
        </template>
      </TabsWidget>
    </FrameSkeleton>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { RouteLocationNamedRaw, useRoute, useRouter } from 'vue-router'
import {
  KDropdownMenu,
  KDropdownItem,
  KAlert,
  KButton,
} from '@kong/kongponents'

import { useStore } from '@/store/store'
import { getSome, stripTimes } from '@/utilities/helpers'
import { PAGE_SIZE_DEFAULT } from '@/constants'
import DataOverview from '@/app/common/DataOverview.vue'
import DocumentationLink from '@/app/common/DocumentationLink.vue'
import FrameSkeleton from '@/app/common/FrameSkeleton.vue'
import { kumaApi } from '@/api/kumaApi'
import LabelList from '@/app/common/LabelList.vue'
import PolicyConnections from '../components/PolicyConnections.vue'
import TabsWidget from '@/app/common/TabsWidget.vue'
import YamlView from '@/app/common/YamlView.vue'
import { PolicyEntity, TableHeader, PolicyDefinition } from '@/types/index.d'
import { patchQueryParam } from '@/utilities/patchQueryParam'

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
    { label: 'Actions', key: 'actions', hideLabel: true },
    { label: 'Name', key: 'name' },
    { label: 'Type', key: 'type' },
  ],
  data: [],
})

const policy = computed(() => store.state.policiesByPath[props.policyPath])
const policies = computed(() => {
  return store.state.policies.map((item) => {
    return {
      length: store.state.sidebar.insights.mesh.policies[item.name],
      ...item,
    }
  }).sort((a, b) => (a.name < b.name ? -1 : 1))
})
const docsURL = computed(() => {
  const kumaDocsVersion = store.getters['config/getKumaDocsVersion']

  return `https://kuma.io/docs/${kumaDocsVersion}/policies/${policy.value.path}/`
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

loadData(props.offset)

const selectedType = ref<PolicyDefinition>(store.state.policies.find((item: PolicyDefinition) => item.path === policy.value.path) || store.state.policies[0])

async function loadData(offset: number): Promise<void> {
  pageOffset.value = offset
  // Puts the offset parameter in the URL so it can be retrieved when the user reloads the page.
  patchQueryParam('offset', offset > 0 ? offset : null)

  isLoading.value = true
  error.value = null

  const name = route.query.ns as string || null
  const mesh = route.params.mesh as string
  const path = policy.value.path

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

      await getEntity({
        mesh: items[0].mesh,
        name: items[0].name,
        path,
      })
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

function changePolicyType(item: PolicyDefinition) {
  selectedType.value = item
  router.push({
    name: item.path,
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
    const item = await kumaApi.getSinglePolicyEntity({ mesh: selectedEntity.mesh, path: policy.value.path, name: selectedEntity.name })

    if (item) {
      const selected = ['type', 'name', 'mesh']

      entity.value = getSome(item, selected)
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
.config-wrapper {
  padding-right: var(--spacing-md);
  padding-left: var(--spacing-md);
  padding-bottom: var(--spacing-md);
}
</style>
