<template>
  <div class="meshgatewayroutes relative">
    <DocumentationLink :href="docsURL" />
    <div class="mb-4">
      <KAlert appearance="warning">
        <template v-slot:alertMessage>
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
        :has-error="hasError"
        :is-loading="isLoading"
        :empty-state="empty_state"
        :table-data="tableData"
        :table-data-is-empty="isEmpty"
        :next="next"
        @tableAction="tableAction"
        @loadData="loadData($event)"
      >
        >
        <template v-slot:additionalControls>
          <KButton
            v-if="$route.query.ns"
            class="back-button"
            appearance="primary"
            size="small"
            :to="{
              name: 'meshgatewayroutes',
            }"
          >
            <span class="custom-control-icon"> &larr; </span>
            View All
          </KButton>
        </template>
      </DataOverview>
      <Tabs
        v-if="isEmpty === false"
        :has-error="hasError"
        :is-loading="isLoading"
        :tabs="tabs"
        initial-tab-override="overview"
      >
        <template v-slot:tabHeader>
          <div>
            <h3>
              Gateway Route: {{ entity.name }}
            </h3>
          </div>
          <div>
            <EntityURLControl
              :name="entity.name"
              :mesh="entity.mesh"
            />
          </div>
        </template>
        <template v-slot:overview>
          <LabelList>
            <div>
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
        <template v-slot:affected-dpps>
          <PolicyConnections
            :mesh="rawEntity.mesh"
            :policy-name="rawEntity.name"
            policy-type="meshgatewayroutes"
          />
        </template>
        <template v-slot:yaml>
          <YamlView
            lang="yaml"
            :content="rawEntity"
          />
        </template>
      </Tabs>
    </FrameSkeleton>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSome, stripTimes } from '@/helpers'
import { getTableData } from '@/utils/tableDataUtils'
import Kuma from '@/services/kuma'
import EntityURLControl from '@/components/Utils/EntityURLControl'
import FrameSkeleton from '@/components/Skeletons/FrameSkeleton'
import DataOverview from '@/components/Skeletons/DataOverview'
import Tabs from '@/components/Utils/Tabs'
import PolicyConnections from '@/components/PolicyConnections/PolicyConnections'
import YamlView from '@/components/Skeletons/YamlView'
import LabelList from '@/components/Utils/LabelList'
import DocumentationLink from '@/components/DocumentationLink/DocumentationLink.vue'
import { PAGE_SIZE_DEFAULT } from '@/consts'

export default {
  name: 'GatewayRoutes',
  metaInfo: {
    title: 'Gateway Routes',
  },
  components: {
    EntityURLControl,
    FrameSkeleton,
    DataOverview,
    Tabs,
    YamlView,
    LabelList,
    PolicyConnections,
    DocumentationLink,
  },
  data() {
    return {
      isLoading: true,
      isEmpty: false,
      hasError: false,
      empty_state: {
        title: 'No Data',
        message: 'There are no Gateway Routes present.',
      },
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
      rawData: [],
      rawEntity: {},
      pageSize: PAGE_SIZE_DEFAULT,
      next: null,
    }
  },
  computed: {
    ...mapGetters({
      version: 'config/getVersion',
    }),
    docsURL() {
      return `https://kuma.io/docs/${this.version}/policies/meshgatewayroute/`
    },
  },
  watch: {
    $route(to, from) {
      this.init()
    },
  },
  beforeMount() {
    this.init()
  },
  methods: {
    init() {
      this.loadData()
    },
    tableAction(ev) {
      const data = ev

      // load the data into the tabs
      this.getEntity(data)
    },
    async loadData(offset = '0') {
      this.isLoading = true

      const query = this.$route.query.ns || null
      const mesh = this.$route.params.mesh || null

      try {
        const { data, next } = await getTableData({
          getSingleEntity: Kuma.getMeshGatewayRoute.bind(Kuma),
          getAllEntities: Kuma.getAllMeshGatewayRoutes.bind(Kuma),
          getAllEntitiesFromMesh: Kuma.getAllMeshGatewayRoutesFromMesh.bind(Kuma),
          mesh,
          query,
          size: this.pageSize,
          offset,
        })

        // set pagination
        this.next = next

        // set table data

        if (data.length) {
          this.isEmpty = false
          this.rawData = data
          this.tableData.data = data

          this.getEntity({ name: data[0].name })
        } else {
          this.tableData.data = []
          this.isEmpty = true
        }
      } catch (error) {
        this.hasError = true
        this.isEmpty = true

        console.error(error)
      } finally {
        this.isLoading = false
      }
    },
    getEntity(entity) {
      const selected = ['type', 'name', 'mesh']
      const item = this.rawData.find((data) => data.name === entity.name)

      this.rawEntity = stripTimes(item)
      this.entity = getSome(item, selected)
    },
  },
}
</script>
