<template>
  <div
    v-if="policy"
    class="relative"
    :class="policy.path"
  >
    <DocumentationLink
      :href="docsURL"
      data-testid="policy-documentation-link"
    />

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
        :page-size="pageSize"
        :has-error="error !== null"
        :error="error"
        :is-loading="isLoading"
        :empty-state="{
          title: 'No Data',
          message: `There are no ${policy.pluralDisplayName} present.`,
        }"
        :table-data="tableData"
        :table-data-is-empty="tableDataIsEmpty"
        :next="next"
        @table-action="getEntity"
        @load-data="loadData($event)"
      >
        >
        <template #additionalControls>
          <KButton
            v-if="$route.query.ns"
            class="back-button"
            appearance="primary"
            size="small"
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
        </template>

        <template #affected-dpps>
          <PolicyConnections
            :mesh="rawEntity.mesh"
            :policy-name="rawEntity.name"
            :policy-type="policy.path"
          />
        </template>

        <template #yaml>
          <YamlView
            lang="yaml"
            :has-error="entityHasError"
            :is-loading="entityIsLoading"
            :is-empty="entityIsEmpty"
            :content="rawEntity"
          />
        </template>
      </TabsWidget>
    </FrameSkeleton>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

import { getSome, stripTimes } from '@/helpers'
import { getTableData } from '@/utils/tableDataUtils'
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

export default {
  name: 'PolicyView',

  components: {
    DataOverview,
    DocumentationLink,
    EntityURLControl,
    FrameSkeleton,
    LabelList,
    PolicyConnections,
    TabsWidget,
    YamlView,
  },

  props: {
    policyPath: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      isLoading: true,
      isEmpty: false,
      error: null,
      entityIsLoading: true,
      entityIsEmpty: false,
      entityHasError: false,
      tableDataIsEmpty: false,
      tableData: {
        headers: [
          { key: 'actions', hideLabel: true },
          { label: 'Name', key: 'name' },
          { label: 'Mesh', key: 'mesh' },
          { label: 'Type', key: 'type' },
        ],
        data: [],
      },
      tabs: [
        {
          hash: '#overview',
          title: 'Overview',
        },
        { hash: '#affected-dpps', title: 'Affected DPPs' },
        {
          hash: '#yaml',
          title: 'YAML',
        },
      ],
      entity: {},
      rawEntity: {},
      pageSize: PAGE_SIZE_DEFAULT,
      next: null,
    }
  },

  computed: {
    ...mapState({
      policiesByPath: (state) => state.policiesByPath,
    }),

    ...mapGetters({
      kumaDocsVersion: 'config/getKumaDocsVersion',
    }),

    policy() {
      return this.policiesByPath[this.policyPath]
    },

    docsURL() {
      return `https://kuma.io/docs/${this.kumaDocsVersion}/policies/${this.policy.path}/`
    },
  },

  watch: {
    $route() {
      // Ensures basic state is reset when switching meshes using the mesh selector.
      this.isLoading = true
      this.isEmpty = false
      this.entityIsLoading = true
      this.entityIsEmpty = false
      this.entityHasError = false
      this.tableDataIsEmpty = false
      this.error = null

      this.loadData()
    },
  },

  beforeMount() {
    this.loadData()
  },

  methods: {
    async loadData(offset = '0') {
      this.isLoading = true
      this.error = null

      const query = this.$route.query.ns || null
      const mesh = this.$route.params.mesh || null
      const path = this.policy.path

      try {
        const { data, next } = await getTableData({
          getSingleEntity: Kuma.getSinglePolicyEntity.bind(Kuma),
          getAllEntitiesFromPath: Kuma.getAllPolicyEntities.bind(Kuma),
          getAllEntitiesFromMesh: Kuma.getAllPolicyEntitiesFromMesh.bind(Kuma),
          path,
          mesh,
          query,
          size: this.pageSize,
          offset,
        })

        // set pagination
        this.next = next

        // set table data

        if (data.length) {
          this.tableData.data = data
          this.tableDataIsEmpty = false
          this.isEmpty = false

          const selected = ['type', 'name', 'mesh']
          const selectedEntity = data[0]

          this.entity = getSome(selectedEntity, selected)
          this.rawEntity = stripTimes(selectedEntity)
        } else {
          this.tableData.data = []
          this.tableDataIsEmpty = true
          this.isEmpty = true
          this.entityIsEmpty = true
        }
      } catch (error) {
        this.error = error
        this.isEmpty = true
      } finally {
        this.isLoading = false
        this.entityIsLoading = false
      }
    },

    getEntity(entity) {
      this.entityIsLoading = true
      this.entityIsEmpty = false
      this.entityHasError = false

      if (entity) {
        return Kuma.getSinglePolicyEntity({ mesh: entity.mesh, path: this.policy.path, name: entity.name })
          .then((item) => {
            if (item) {
              const selected = ['type', 'name', 'mesh']

              this.entity = getSome(item, selected)
              this.rawEntity = stripTimes(item)
            } else {
              this.entity = {}
              this.entityIsEmpty = true
            }
          })
          .catch((error) => {
            this.entityHasError = true
            console.error(error)
          })
          .finally(() => {
            setTimeout(() => {
              this.entityIsLoading = false
            }, import.meta.env.VITE_DATA_TIMEOUT)
          })
      } else {
        setTimeout(() => {
          this.entityIsEmpty = true
          this.entityIsLoading = false
        }, import.meta.env.VITE_DATA_TIMEOUT)
      }
    },
  },
}
</script>
