<template>
  <div class="overview">
    <page-header noflex>
      <breadcrumbs />
      <h2 class="xxl">
        {{ this.$route.meta.title }}
      </h2>
    </page-header>

    <DataOverview
      :has-error="hasError"
      :is-loading="isLoading"
      :is-empty="isEmpty"
      :empty-state="empty_state"
      :display-data-table="true"
      :table-data="tableData"
      :table-data-is-empty="tableDataIsEmpty"
      @reloadData="bootstrap"
    />

    <Tabs
      :initial-tab="initialTab"
      :tabs="tabs"
    >
      <template slot="tab-link-overview">
        Overview
      </template>
      <template slot="tab-content-overview">
        <KCard title="Tab 1 Is Here">
          <template slot="body">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit
              error iusto beatae fugit nemo, aliquid modi itaque aliquam, perferendis
              nostrum praesentium optio. Quia esse voluptas corporis ipsa porro!
              Recusandae, tempora.
            </p>
          </template>
        </KCard>
      </template>

      <template slot="tab-link-yaml-view">
        YAML
      </template>
      <template slot="tab-content-yaml-view">
        <KCard title="Say Hello to Tab Content 2!">
          <template slot="body">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat velit
              repudiandae quo voluptatem incidunt exercitationem quisquam, veniam
              corrupti maxime! Modi iusto veniam suscipit, a qui ad doloribus quas
              pariatur ratione.
            </p>
          </template>
        </KCard>
      </template>
    </Tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PageHeader from '@/components/Utils/PageHeader.vue'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import DataOverview from '@/components/Skeletons/DataOverview.vue'

// test items
import KCard from '@kongponents/kcard'
import Tabs from '@/components/Utils/Tabs'

export default {
  name: 'Overview',
  metaInfo () {
    return {
      title: this.$route.meta.title
    }
  },
  components: {
    PageHeader,
    Breadcrumbs,
    DataOverview,
    KCard,
    Tabs
  },
  data () {
    return {
      isLoading: true,
      isEmpty: false,
      hasError: false,
      tableDataIsEmpty: false,
      empty_state: {
        title: 'No Data',
        message: 'There are no Meshes present.'
      },
      tableData: {
        headers: [
          { label: 'Mesh', key: 'name' },
          { label: 'Online Dataplanes', key: 'onlineDpCount' }
        ],
        data: []
      },
      initialTab: 'overview',
      tabs: [
        'overview',
        'yaml-view'
      ]
    }
  },
  computed: {
    ...mapGetters({
      title: 'getTagline'
    })
  },
  watch: {
    '$route' (to, from) {
      this.bootstrap()
    }
  },
  beforeMount () {
    this.bootstrap()
  },
  methods: {
    bootstrap () {
      this.isLoading = true
      this.isEmpty = false

      // get (or refresh) the full dataplane list
      this.$store.dispatch('getAllDataplanes')

      // prepare and populate the table data
      const getMeshData = () => {
        const dpList = this.$store.state.totalDataplaneList

        return this.$api.getAllMeshes()
          .then(response => {
            const items = response.items
            const itemStatus = []

            for (let i = 0; i < items.length; i++) {
              const mesh = items[i].name

              const dpStatus = () => {
                const totalDpInMesh = dpList.filter(x => x.mesh === mesh).length
                const onlineDpCount = dpList.filter(x => x.status === 'Online' && x.mesh === mesh).length

                if (totalDpInMesh === 0) {
                  return 'No Dataplanes'
                } else {
                  return `${onlineDpCount} of ${totalDpInMesh}`
                }
              }

              itemStatus.push({
                name: mesh,
                onlineDpCount: dpStatus()
              })
            }

            if (items && items.length) {
              this.tableData.data = [...itemStatus]
              this.tableDataIsEmpty = false
            } else {
              this.tableData.data = []
              this.tableDataIsEmpty = true
            }
          })
          .catch(error => {
            this.hasError = true

            console.error(error)
          })
          .finally(() => {
            setTimeout(() => {
              this.isLoading = false
            }, process.env.VUE_APP_DATA_TIMEOUT)
          })
      }

      getMeshData()
    }
  }
}
</script>

<style lang="scss">
.empty-state-title {

  .card-icon {
    text-align: center;

    img, svg {
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
  }
}
</style>
