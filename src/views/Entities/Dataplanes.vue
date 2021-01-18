<template>
  <div class="dataplanes">
    <FrameSkeleton>
      <DataOverview
        :page-size="pageSize"
        :has-error="hasError"
        :is-loading="isLoading"
        :empty-state="empty_state"
        :display-data-table="true"
        :table-data="tableData"
        :table-data-is-empty="tableDataIsEmpty"
        table-data-function-text="View"
        table-data-row="name"
        @tableAction="tableAction"
        @reloadData="loadData"
      >
        <template slot="additionalControls">
          <KButton
            class="add-dp-button"
            appearance="primary"
            size="small"
            :to="dataplaneWizardRoute"
          >
            <span class="custom-control-icon">
              +
            </span>
            Create data plane proxy
          </KButton>
          <KButton
            v-if="this.$route.query.ns"
            class="back-button"
            appearance="primary"
            size="small"
            :to="{
              name: 'dataplanes'
            }"
          >
            <span class="custom-control-icon">
              &larr;
            </span>
            View All
          </KButton>
        </template>
        <template slot="pagination">
          <Pagination
            :has-previous="previous.length > 0"
            :has-next="hasNext"
            @next="goToNextPage"
            @previous="goToPreviousPage"
          />
        </template>
      </DataOverview>
      <Tabs
        v-if="isEmpty === false"
        :has-error="hasError"
        :is-loading="isLoading"
        :tabs="tabs"
        initial-tab-override="overview"
      >
        <template slot="tabHeader">
          <div>
            <h3>{{ tabGroupTitle }}</h3>
          </div>
          <div>
            <EntityURLControl :url="shareUrl" />
          </div>
        </template>
        <template slot="overview">
          <LabelList
            :has-error="entityHasError"
            :is-loading="entityIsLoading"
            :is-empty="entityIsEmpty"
          >
            <!-- basic information -->
            <div>
              <ul>
                <li
                  v-for="(val, key) in entity.basicData"
                  :key="key"
                >
                  <h4>{{ key }}</h4>
                  <p>
                    {{ val }}
                  </p>
                </li>
              </ul>
            </div>
            <!-- tag information -->
            <div>
              <h4>Tags</h4>
              <p>
                <span
                  v-for="(val, key) in entity.tags"
                  :key="key"
                  class="tag-cols"
                >
                  <span>
                    {{ val.label }}:
                  </span>
                  <span>
                    {{ val.value }}
                  </span>
                </span>
              </p>
            </div>
          </LabelList>
          <div
            v-if="!isEnvoySupported()"
            class="m-4 mt-0 rounded border p-4 bg-yellow-100 border-yellow-300 color-yellow-400 yaml-view"
          >
            <p>There is mismatch between Kuma DP version and supported Envoy version.</p>
            <prism
              class="code-block"
              language="yaml"
              :code="getVersionConditions()"
            />
          </div>
        </template>
        <template slot="mtls">
          <LabelList
            :has-error="entityHasError"
            :is-loading="entityIsLoading"
            :is-empty="entityIsEmpty"
          >
            <ul v-if="entity.mtls">
              <li
                v-for="(val, key) in entity.mtls"
                :key="key"
              >
                <h4>{{ val.label }}</h4>
                <p>
                  {{ val.value }}
                </p>
              </li>
            </ul>
            <KAlert
              v-else
              appearance="danger"
            >
              <template slot="alertMessage">
                This data plane proxy does not yet have mTLS configured &mdash;
                <a
                  :href="`https://kuma.io/docs/${version}/documentation/security/#certificates`"
                  class="external-link"
                  target="_blank"
                >
                  Learn About Certificates in {{ $productName }}
                </a>
              </template>
            </KAlert>
          </LabelList>
        </template>
        <template slot="yaml">
          <YamlView
            :title="entityOverviewTitle"
            :has-error="entityHasError"
            :is-loading="entityIsLoading"
            :is-empty="entityIsEmpty"
            :content="rawEntity"
          />
        </template>
      </Tabs>
    </FrameSkeleton>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOffset, getSome, stripTimes, verifyVersion } from '@/helpers'
import EntityURLControl from '@/components/Utils/EntityURLControl'
import sortEntities from '@/mixins/EntitySorter'
import FrameSkeleton from '@/components/Skeletons/FrameSkeleton'
import Pagination from '@/components/Pagination'
import DataOverview from '@/components/Skeletons/DataOverview'
import Tabs from '@/components/Utils/Tabs'
import YamlView from '@/components/Skeletons/YamlView'
import LabelList from '@/components/Utils/LabelList'
import { dpTags, reduceSubscriptions, parseMTLS } from '@/dataplane'

import Prism from 'vue-prismjs'
import 'prismjs/themes/prism.css'
import json2yaml from '@appscode/json2yaml'

export default {
  name: 'Dataplanes',
  metaInfo: {
    title: 'Data plane proxies'
  },
  components: {
    EntityURLControl,
    FrameSkeleton,
    Pagination,
    DataOverview,
    Tabs,
    YamlView,
    LabelList,
    prism: Prism
  },
  mixins: [
    sortEntities
  ],
  data () {
    return {
      isLoading: true,
      isEmpty: false,
      hasError: false,
      entityIsLoading: true,
      entityIsEmpty: false,
      entityHasError: false,
      tableDataIsEmpty: false,
      empty_state: {
        title: 'No Data',
        message: 'There are no data plane proxies present.'
      },
      tableData: {
        headers: [
          { key: 'actions', hideLabel: true },
          { label: 'Status', key: 'status' },
          { label: 'Name', key: 'name' },
          { label: 'Mesh', key: 'mesh' },
          { label: 'Type', key: 'type' },
          { label: 'Tags', key: 'tags' },
          { label: 'Last Connected', key: 'lastConnected' },
          { label: 'Last Updated', key: 'lastUpdated' },
          { label: 'Total Updates', key: 'totalUpdates' },
          { label: 'Kuma DP version', key: 'dpVersion' },
          { label: 'Envoy version', key: 'envoyVersion' },
          { key: 'versionStatus', hideLabel: true },
        ],
        data: []
      },
      tabs: [
        {
          hash: '#overview',
          title: 'Overview'
        },
        {
          hash: '#mtls',
          title: 'Certificate Insights'
        },
        {
          hash: '#yaml',
          title: 'YAML'
        }
      ],
      entity: [],
      rawEntity: null,
      firstEntity: null,
      pageSize: this.$pageSize,
      pageOffset: null,
      next: null,
      hasNext: false,
      previous: [],
      tabGroupTitle: null,
      entityNamespace: null,
      entityOverviewTitle: null,
      showmTLSTab: false
    }
  },
  computed: {
    ...mapGetters({
      environment: 'getEnvironment',
      queryNamespace: 'getItemQueryNamespace'
    }),
    dataplaneWizardRoute () {
      // we change the route to the Dataplane
      // wizard based on environment.
      if (this.environment === 'universal') {
        return { name: 'universal-dataplane' }
      } else {
        return { name: 'kubernetes-dataplane' }
      }
    },
    version () {
      const storedVersion = this.$store.getters.getVersion

      return (storedVersion !== null) ? storedVersion : 'latest'
    },
    shareUrl () {
      const urlRoot = `${window.location.origin}/#`
      const entity = this.entity

      const shareUrl = () => {
        if (entity.basicData) {
          if (this.$route.query.ns) {
            return this.$route.fullPath
          }

          return `${urlRoot}${this.$route.fullPath}?ns=${entity.basicData.name}`
        }

        return null
      }

      return shareUrl()
    }
  },
  watch: {
    '$route' (to, from) {
      this.loadData()
    }
  },
  beforeMount () {
    this.loadData()
    this.parseSupportedVersions()
  },
  methods: {
    init () {
      this.loadData()
    },
    parseSupportedVersions() {
      const rawSupportedVersion = process.env.VUE_APP_KUMA_SUPPORTED_VERSIONS

      this.supportedVersions = rawSupportedVersion
        ? JSON.parse(rawSupportedVersion)
        : {}
    },
    isEnvoySupported () {
      if (this.isLoading || !this.entity) {
        return true
      }

      const { dpVersion, envoyVersion } = this.entity

      const expected = this.supportedVersions[dpVersion]

      if (expected && expected.envoy) {
        return verifyVersion(envoyVersion, expected.envoy)
      }

      return true
    },
    getVersionConditions () {
      const { dpVersion } = this.entity

      return json2yaml({
        [`kuma-dp@${dpVersion}`]: this.supportedVersions[dpVersion]
      })
    },
    goToPreviousPage () {
      this.pageOffset = this.previous.pop()
      this.next = null

      this.loadData()
    },
    goToNextPage () {
      this.previous.push(this.pageOffset)
      this.pageOffset = this.next
      this.next = null

      this.loadData()
    },
    tableAction (ev) {
      const data = ev

      // reset back to the first tab
      this.$store.dispatch('updateSelectedTab', this.tabs[0].hash)

      // set the active table row
      this.$store.dispatch('updateSelectedTableRow', data.name)

      // load the data into the tabs
      this.getEntity(data)
    },
    loadData () {
      this.isLoading = true

      const mesh = this.$route.params.mesh || null
      const query = this.$route.query.ns || null

      const params = {
        size: this.pageSize,
        offset: this.pageOffset
      }

      const placeholder = 'n/a'

      /**
       * determine which endpoint to use based on the mesh.
       * we are either fetching entities from one mesh, or fetching
       * all of them from all meshes and collecting them into the view.
       */
      const endpoint = () => {
        if (mesh === 'all') {
          return this.$api.getAllDataplaneOverviews(params)
        } else if ((query && query.length) && mesh !== 'all') {
          return this.$api.getDataplaneOverviewFromMesh(mesh, query)
        }

        return this.$api.getAllDataplaneOverviewsFromMesh(mesh, params)
      }

      /**
       * the function used for fetching dataplanes from a mesh
       * and then collecting them into an array.
       */
      const dpFetcher = (mesh, name, finalArr) => {
        this.$api.getDataplaneOverviewFromMesh(mesh, name)
          .then(response => {
            /**
             * Dataplane type conditions
             */
            const inbound = response.dataplane.networking.inbound || null
            const gateway = response.dataplane.networking.gateway || null
            const ingress = response.dataplane.networking.ingress || null

            /**
             * Determine the type of Dataplane it is
             */
            const dataplaneType = () => {
              if (gateway) {
                return 'Gateway'
              } else if (ingress) {
                return 'Ingress'
              }

              return 'Standard'
            }

            // assemble the table data
            finalArr.push({
              name: response.name,
              mesh: response.mesh,
              tags: dpTags(response.dataplane),
              type: dataplaneType(),
              ...reduceSubscriptions(response.dataplaneInsight.subscriptions)
            })

            this.sortEntities(finalArr)

            return finalArr
          })
          .catch(error => {
            console.error(error)
          })
      }

      const getDataplanes = () => {
        return endpoint()
          .then(response => {
            const items = () => {
              const r = response

              if ('total' in r) {
                if (r.total !== 0 && r.items && r.items.length > 0) {
                  return this.sortEntities(r.items)
                }

                return null
              }

              return r
            }

            if (items()) {
              // check to see if the `next` url is present
              if (response.next) {
                this.next = getOffset(response.next)
                this.hasNext = true
              } else {
                this.hasNext = false
              }

              const final = []
              const itemSelect = query
                ? items()
                : items()[0]

              // set the first item as the default for initial load
              this.firstEntity = itemSelect.name

              // load the YAML entity for the first item on page load
              this.getEntity(itemSelect)

              // set the selected table row for the first item on page load
              this.$store.dispatch('updateSelectedTableRow', this.firstEntity)

              if ((query && query.length) && (mesh && mesh.length)) {
                dpFetcher(mesh, query, final)
              } else {
                items().forEach(item => {
                  dpFetcher(item.mesh, item.name, final)
                })
              }

              this.tableData.data = final
              this.tableDataIsEmpty = false
              this.isEmpty = false
            } else {
              this.tableData.data = []
              this.tableDataIsEmpty = true
              this.isEmpty = true

              this.getEntity(null)
            }
          })
          .catch(error => {
            this.hasError = true
            this.isEmpty = true

            console.error(error)
          })
          .finally(() => {
            setTimeout(() => {
              this.isLoading = false
            }, process.env.VUE_APP_DATA_TIMEOUT)
          })
      }

      getDataplanes()
    },
    getEntity (entity) {
      this.entityIsLoading = true
      this.entityIsEmpty = false

      const mesh = this.$route.params.mesh

      if (entity) {
        const entityMesh = (mesh === 'all')
          ? entity.mesh
          : mesh

        return this.$api.getDataplaneFromMesh(entityMesh, entity.name)
          .then(response => {
            if (response) {
              const selected = ['type', 'name', 'mesh']

              const getDataPlaneOverview = async () => {
                const overview = {
                  mtls: null,
                  dpVersion: null,
                  envoyVersion: null,
                }

                try {
                  const res = await this.$api.getDataplaneOverviewFromMesh(entityMesh, entity.name)

                  // get mTLS data if it's present
                  if (res.dataplaneInsight) {
                    if (res.dataplaneInsight.mTLS) {
                      overview.mtls = parseMTLS(res.dataplaneInsight.mTLS)
                    }

                    if (res.dataplaneInsight.subscriptions) {
                      const { dpVersion, envoyVersion } = reduceSubscriptions(res.dataplaneInsight.subscriptions)

                      overview.dpVersion = dpVersion
                      overview.envoyVersion = envoyVersion
                    }
                  }
                } catch (error) {
                  console.error(error)
                }

                return overview
              }

              const newEntity = async () => ({
                basicData: { ...getSome(response, selected) },
                tags: dpTags(response),
                ...await getDataPlaneOverview()
              })

              newEntity().then(i => {
                this.entity = i
                this.entityNamespace = i.basicData.name
                this.tabGroupTitle = `Mesh: ${i.basicData.name}`
                this.entityOverviewTitle = `Entity Overview for ${i.basicData.name}`
              })

              // this.rawEntity = response
              this.rawEntity = stripTimes(response)
            } else {
              this.entity = null
              this.entityIsEmpty = true
            }
          })
          .catch(error => {
            this.entityHasError = true
            console.error(error)
          })
          .finally(() => {
            setTimeout(() => {
              this.entityIsLoading = false
            }, process.env.VUE_APP_DATA_TIMEOUT)
          })
      } else {
        setTimeout(() => {
          this.entityIsEmpty = true
          this.entityIsLoading = false
        }, process.env.VUE_APP_DATA_TIMEOUT)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.add-dp-button {
  background-color: var(--logo-green) !important;
}

.code-block {
  border-radius: 3px;
  background-color: rgba(150, 58, 133, 0.05);
  font-size: var(--type-sm);
}
</style>
