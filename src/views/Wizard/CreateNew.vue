<template>
  <div class="wizard">
    <div class="wizard__content">
      <StepSkeleton
        :steps="steps"
        :advance-check="canAdvance"
        :sidebar-content="sidebarContent"
      >
        <!-- step content -->
        <template slot="general">
          <page-header noflex>
            <h2 class="xxl">
              Create a new Mesh
            </h2>
          </page-header>
          <p class="my-4">
            Welcome to the wizard for creating a new Mesh entity in Kuma.
            We will be providing you with a few steps that will get you started.
          </p>
          <p class="my-4">
            As you know, the Kuma GUI is read-only, so at the end of this wizard
            we will be generating the configuration that you can apply with either
            <code>kubectl</code> (if you are running in Kubernetes mode) or
            kumactl / API (if you are running in Universal mode).
          </p>

          <h3 class="xl">
            To get started, please fill-in the following information:
          </h3>

          <KCard
            class="my-6 k-card--small"
            title="Mesh Information"
            has-shadow
          >
            <template slot="body">
              <form id="entity-name-selection">
                <div class="form-line">
                  <div>
                    <label
                      for="mesh-name"
                      class="k-input-label"
                    >
                      Mesh name:
                    </label>
                  </div>
                  <div>
                    <input
                      id="mesh-name"
                      type="text"
                      class="k-input w-100"
                      placeholder="your-mesh-name"
                      :value="$route.query.name ? $route.query.name : ''"
                      @change="pushQuery('name', $event.target.value.replace(/ /g, '-').toLowerCase())"
                    >
                  </div>
                </div>
                <div class="form-line">
                  <div>
                    <label class="k-input-label">
                      Mutual TLS:
                    </label>
                  </div>
                  <div>
                    <label class="k-input-label mx-2">
                      <input
                        id="mtls-enabled"
                        value="enabled"
                        name="mtls"
                        type="radio"
                        class="k-input mr-2"
                        :checked="($route.query.mtls && $route.query.mtls === 'enabled') ? true : false"
                        @change="pushQuery('mtls', 'enabled')"
                      >
                      <span>Enabled</span>
                    </label>
                    <label class="k-input-label mx-2">
                      <input
                        id="mtls-disabled"
                        value="disabled"
                        name="mtls"
                        type="radio"
                        class="k-input mr-2"
                        :checked="($route.query.mtls && $route.query.mtls === 'disabled') ? true : false"
                        @change="pushQuery('mtls', 'disabled')"
                      >
                      <span>Disabled</span>
                    </label>
                  </div>
                </div>
                <div
                  v-if="$route.query.mtls === 'enabled'"
                  class="form-line"
                >
                  <div>
                    <label
                      for="certificate-authority"
                      class="k-input-label"
                    >
                      Certificate Authority:
                    </label>
                  </div>
                  <div>
                    <select
                      id="certificate-authority"
                      class="k-input w-100"
                      name="certificate-authority"
                      @change="pushQuery('ca', $event.target.value)"
                    >
                      <option
                        selected
                        disabled
                      >
                        Select One&hellip;
                      </option>
                      <option
                        value="built-in"
                        :selected="($route.query.ca && $route.query.ca === 'built-in') ? true : false"
                      >
                        built-in
                      </option>
                      <option
                        value="provided"
                        :selected="($route.query.ca && $route.query.ca === 'provided') ? true : false"
                      >
                        provided
                      </option>
                      <option
                        value="vault"
                        :selected="($route.query.ca && $route.query.ca === 'vault') ? true : false"
                      >
                        vault
                      </option>
                    </select>
                  </div>
                </div>
              </form>
            </template>
          </KCard>
        </template>
        <template slot="logging">
          <p>Some content for LOGGING</p>
        </template>
        <template slot="tracing">
          <p>Some content for TRACING</p>
        </template>
        <template slot="metrics">
          <p>Some content for METRICS</p>
        </template>
        <template slot="complete">
          <p>You're done!</p>
        </template>

        <!-- sidebar content -->
        <template slot="mesh">
          <h3>Mesh</h3>
          <p>
            In {{ title }}, a Mesh entity allows you to define an isolated environment
            for your data-planes and policies. It's isolated because the mTLS CA
            you choose can be different from the one configured for our Meshes.
            Ideally, you will have either a large Mesh with all the workloads, or
            one Mesh per application for better isolation.
          </p>
          <p>
            <a
              :href="`https://kuma.io/docs/${version}/policies/mesh/`"
              target="_blank"
            >
              Learn More
            </a>
          </p>
        </template>
        <template slot="did-you-know">
          <h3>Did You Know?</h3>
          <p>
            As you know, the GUI is read-only, but it will be providing instructions
            to create a new Mesh and verify everything worked well.
          </p>
        </template>
      </StepSkeleton>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PageHeader from '@/components/Utils/PageHeader.vue'
import StepSkeleton from './components/StepSkeleton'

export default {
  metaInfo: {
    title: 'Wizard'
  },
  components: {
    PageHeader,
    StepSkeleton
  },
  data () {
    return {
      steps: [
        {
          label: 'General & Security',
          slug: 'general'
        },
        {
          label: 'Logging',
          slug: 'logging'
        },
        {
          label: 'Tracing',
          slug: 'tracing'
        },
        {
          label: 'Metrics',
          slug: 'metrics'
        },
        {
          label: 'Done!',
          slug: 'complete'
        }
      ],
      sidebarContent: [
        {
          name: 'mesh'
        },
        {
          name: 'did-you-know'
        }
      ]
    }
  },
  computed: {
    pageTitle () {
      const query = this.$route.query

      if (query.type) {
        return `Create a new ${query.type}`
      } else {
        return 'Create a new entity'
      }
    },
    canAdvance () {
      const query = this.$route.query
      const name = query.name
      const mtls = query.mtls

      if (
        (undefined !== name && name.length > 0) &&
        (undefined !== mtls && mtls.length > 0)
      ) {
        return true
      } else {
        return false
      }
    },
    ...mapGetters({
      title: 'getTagline',
      version: 'getVersion'
    })
  },
  methods: {
    goToNextStep (ev) {

    },
    pushQuery (query, value) {
      const router = this.$router
      const route = this.$route

      if (!route.query) {
        // if the URL contains no current queries, simply add the query and value
        router.push({
          query: {
            [query]: value
          }
        })
      } else {
        // otherwise append it to the existing queries
        router.push({
          query: Object.assign({}, route.query, {
            [query]: value
          })
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wizard {

}

.wizard__content {

}
</style>
