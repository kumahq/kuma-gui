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
      <template slot="tab-link-tab-1">
        Go to Tab 1
      </template>
      <template slot="tab-content-tab-1">
        <h3>Tab Content 1</h3>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dicta, veniam
          fugiat, officiis perferendis esse excepturi saepe cupiditate eligendi hic
          tempore nobis, necessitatibus molestias officia dolore iste laboriosam deleniti. Facilis, iusto.
        </p>
      </template>

      <template slot="tab-link-tab-2">
        Go to Tab 2
      </template>
      <template slot="tab-content-tab-2">
        <h3>Tab Content 2</h3>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dicta, veniam
          fugiat, officiis perferendis esse excepturi saepe cupiditate eligendi hic
          tempore nobis, necessitatibus molestias officia dolore iste laboriosam deleniti. Facilis, iusto.
        </p>
      </template>

      <template slot="tab-link-tab-3">
        Go to Tab 3
      </template>
      <template slot="tab-content-tab-3">
        <h3>Tab Content 3</h3>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dicta, veniam
          fugiat, officiis perferendis esse excepturi saepe cupiditate eligendi hic
          tempore nobis, necessitatibus molestias officia dolore iste laboriosam deleniti. Facilis, iusto.
        </p>
      </template>
    </Tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PageHeader from '@/components/Utils/PageHeader.vue'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import DataOverview from '@/components/Skeletons/DataOverview.vue'
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
      initialTab: 'tab-1',
      tabs: [
        'tab-1',
        'tab-2',
        'tab-3'
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
