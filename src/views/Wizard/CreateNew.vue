<template>
  <div class="wizard">
    <div class="wizard__content">
      <StepSkeleton :steps="steps">
        <template slot="general">
          <page-header noflex>
            <h2 class="xxl">
              Create a new Mesh
            </h2>
          </page-header>
          <p class="my-2">
            Welcome to the wizard for creating a new Mesh entity in Kuma.
            We will be providing you with a few steps that will get you started.
          </p>
          <p class="my-2">
            As you know, the Kuma GUI is read-only, so at the end of this wizard
            we will be generating the configuration that you can apply with either
            <pre>kubectl</pre> (if you are running in Kubernetes mode) or
            kumactl / API (if you are running in Universal mode).
          </p>
          <h3 class="xl">
            To get started, please fill-in the following information:
          </h3>
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
                  class="k-input"
                  placeholder="Enter a Mesh name"
                >
              </div>
            </div>
          </form>
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
      </StepSkeleton>
    </div>
  </div>
</template>

<script>
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
    }
  },
  methods: {
    goToNextStep (ev) {
      this.$router.push({
        query: Object.assign({}, this.$route.query, {
          topology: ev
        })
      })
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
