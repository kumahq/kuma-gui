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
        :page-size="PAGE_SIZE_DEFAULT"
        :has-error="error !== null"
        :error="error"
        :is-loading="isLoading"
        :empty-state="{
          title: 'No Data',
          message: `There are no ${policy.pluralDisplayName} present.`,
        }"
        :table-data="tableData"
        :table-data-is-empty="tableDataIsEmpty"
        :next="nextUrl"
        @table-action="getEntity"
        @load-data="loadData"
      >
        >
        <template #additionalControls>
          <DocumentationLink
            :href="docsURL"
            data-testid="policy-documentation-link"
          />

          <KButton
            v-if="$route.query.ns"
            class="back-button"
            appearance="primary"
            :to="{ name: policy.path }"
          >
            <span class="custom-control-icon"> &larr; </span>
            View All
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
            <h3 data-testid="policy-single-entity">
              {{ policy.singularDisplayName }}: {{ entity.name }}
            </h3>
          </div>

          <div>
            <EntityURLControl
              :name="entity.name"
              :mesh="entity.mesh"
            />
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
import { useRoute } from 'vue-router'

import { useStore } from '@/store/store'
import { getSome, stripTimes } from '@/helpers'
import { PAGE_SIZE_DEFAULT } from '@/consts'
import DataOverview from '@/components/Skeletons/DataOverview.vue'
import DocumentationLink from '@/components/DocumentationLink/DocumentationLink.vue'
import EntityURLControl from '@/components/Utils/EntityURLControl.vue'
import FrameSkeleton from '@/components/Skeletons/FrameSkeleton.vue'
import Kuma from '@/services/kuma'
import LabelList from '@/components/Utils/LabelList.vue'
import PolicyConnections from '@/components/PolicyConnections/PolicyConnections.vue'
import TabsWidget from '@/components/Utils/TabsWidget.vue'
import YamlView from '@/components/Skeletons/YamlView.vue'
import { PolicyEntity, TableHeader } from '@/types'

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

const route = useRoute()
const store = useStore()

const props = defineProps({
  policyPath: {
    type: String,
    required: true,
  },
})

const isLoading = ref(true)
const isEmpty = ref(false)
const error = ref<any>(null)
const entityIsLoading = ref(true)
const entityIsEmpty = ref(false)
const entityHasError = ref(false)
const tableDataIsEmpty = ref(false)
const entity = ref<any>({})
const rawEntity = ref<Omit<PolicyEntity, 'creationTime' | 'modificationTime'> | null>(null)
const nextUrl = ref<string | null>(null)

const tableData = ref<{ headers: TableHeader[], data: any[] }>({
  headers: [
    { label: 'Actions', key: 'actions', hideLabel: true },
    { label: 'Name', key: 'name' },
    { label: 'Mesh', key: 'mesh' },
    { label: 'Type', key: 'type' },
  ],
  data: [],
})

const policy = computed(() => store.state.policiesByPath[props.policyPath])
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

  loadData()
})

loadData()

async function loadData(offset: number = 0): Promise<void> {
  isLoading.value = true
  error.value = null

  const name = route.query.ns as string || null
  const mesh = route.params.mesh as string
  const path = policy.value.path

  try {
    let items: PolicyEntity[]

    if (mesh !== null && name !== null) {
      const item = await Kuma.getSinglePolicyEntity({ mesh, path, name })
      items = [item]
      nextUrl.value = null
    } else {
      const params = {
        size: PAGE_SIZE_DEFAULT,
        offset,
      }
      const response = await Kuma.getAllPolicyEntitiesFromMesh({ mesh, path }, params)
      items = response.items
      nextUrl.value = response.next
    }

    // set table data
    if (items.length > 0) {
      tableData.value.data = items.map((entity) => processEntity(entity))
      tableDataIsEmpty.value = false
      isEmpty.value = false

      const selected = ['type', 'name', 'mesh']
      const selectedEntity = items[0]

      entity.value = getSome(selectedEntity, selected)
      rawEntity.value = stripTimes(selectedEntity)
    } else {
      tableData.value.data = []
      tableDataIsEmpty.value = true
      isEmpty.value = true
      entityIsEmpty.value = true
    }
  } catch (err) {
    error.value = err
    isEmpty.value = true
  } finally {
    isLoading.value = false
    entityIsLoading.value = false
  }
}

function processEntity(entity: PolicyEntity): any {
  if (!entity.mesh) {
    return entity
  }

  const processedEntity: any = entity

  const meshRoute = {
    name: 'mesh-detail-view',
    params: {
      mesh: entity.mesh,
    },
  }
  processedEntity.meshRoute = meshRoute

  return processedEntity
}

async function getEntity(entity: any): Promise<void> {
  entityHasError.value = false
  entityIsLoading.value = true
  entityIsEmpty.value = false

  if (entity) {
    try {
      const item = await Kuma.getSinglePolicyEntity({ mesh: entity.mesh, path: policy.value.path, name: entity.name })

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
}
</script>

<style lang="scss" scoped>
.config-wrapper {
  padding-right: var(--spacing-md);
  padding-left: var(--spacing-md);
  padding-bottom: var(--spacing-md);
}
</style>
