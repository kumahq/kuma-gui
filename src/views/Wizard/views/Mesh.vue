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
          <p>
            Welcome to the wizard for creating a new Mesh entity in Kuma.
            We will be providing you with a few steps that will get you started.
          </p>
          <p>
            As you know, the Kuma GUI is read-only, so at the end of this wizard
            we will be generating the configuration that you can apply with either
            <code>kubectl</code> (if you are running in Kubernetes mode) or
            kumactl / API (if you are running in Universal mode).
          </p>

          <h3>
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
                      :value="getStorageItem('meshName')"
                      @change="updateStorage('meshName', $event.target.value.replace(/ /g, '-').toLowerCase())"
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
                        :checked="formConditions.mtlsEnabled === true"
                        @change="updateStorage('meshMtls', 'enabled'); formConditions.mtlsEnabled = true"
                      >
                      <span>Enabled</span>
                    </label>
                    <label class="k-input-label mx-2">
                      <input
                        ref="mtlsDisabled"
                        value="disabled"
                        name="mtls"
                        type="radio"
                        class="k-input mr-2"
                        :checked="formConditions.mtlsEnabled === false"
                        @change="updateStorage('meshMtls', 'disabled', 'ca'); formConditions.mtlsEnabled = false"
                      >
                      <span>Disabled</span>
                    </label>
                  </div>
                </div>
                <div
                  v-if="formConditions.mtlsEnabled === true"
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
                      @change="updateStorage('meshCA', $event.target.value)"
                    >
                      <option
                        selected
                        disabled
                      >
                        Select a CA&hellip;
                      </option>
                      <option
                        value="built-in"
                        :selected="(getStorageItem('meshCA') === 'built-in') ? true : false"
                      >
                        built-in
                      </option>
                      <option
                        value="provided"
                        :selected="(getStorageItem('meshCA') === 'provided') ? true : false"
                      >
                        provided
                      </option>
                      <option
                        value="vault"
                        :selected="(getStorageItem('meshCA') === 'vault') ? true : false"
                      >
                        vault
                      </option>
                    </select>
                    <p class="help">
                      If you've enabled mTLS, you must select a CA.
                    </p>
                  </div>
                </div>
              </form>
            </template>
          </KCard>
        </template>
        <template slot="logging">
          <h3>
            Setup Logging
          </h3>
          <p>
            You can setup as many logging backends as you need that you can later
            use to log traffic via the &quot;TrafficLog&quot; policy. In this wizard,
            we allow you to configure one backend, but you can add more manually
            if you wish.
          </p>
          <KCard
            class="my-6 k-card--small"
            title="Logging Configuration"
            has-shadow
          >
            <template slot="body">
              <form>
                <div class="form-line">
                  <div>
                    <label class="k-input-label">
                      Logging
                    </label>
                  </div>
                  <div>
                    <label class="k-input-label mx-2">
                      <input
                        id="logging-enabled"
                        value="enabled"
                        name="logging"
                        type="radio"
                        class="k-input mr-2"
                        :checked="formConditions.loggingEnabled === true"
                        @change="updateStorage('meshLoggingStatus', 'enabled'); formConditions.loggingEnabled = true"
                      >
                      <span>Enabled</span>
                    </label>
                    <label class="k-input-label mx-2">
                      <input
                        id="logging-disabled"
                        value="disabled"
                        name="logging"
                        type="radio"
                        class="k-input mr-2"
                        :checked="formConditions.loggingEnabled === false"
                        @change="updateStorage('meshLoggingStatus', 'disabled'); formConditions.loggingEnabled = false"
                      >
                      <span>Disabled</span>
                    </label>
                  </div>
                </div>
                <div
                  v-if="formConditions.loggingEnabled === true"
                  class="form-group"
                >
                  <div class="form-line">
                    <div>
                      <label
                        for="backend-name"
                        class="k-input-label"
                      >
                        Backend name:
                      </label>
                    </div>
                    <div>
                      <input
                        id="backend-name"
                        type="text"
                        class="k-input w-100"
                        placeholder="your-backend-name"
                        :value="getStorageItem('meshLoggingBackend')"
                        @change="updateStorage('meshLoggingBackend', $event.target.value.replace(/ /g, '-').toLowerCase())"
                      >
                    </div>
                  </div>
                  <div class="form-line">
                    <div>
                      <label
                        for="logging-type"
                        class="k-input-label"
                      >
                        Type:
                      </label>
                    </div>
                    <div>
                      <select
                        id="logging-type"
                        class="k-input w-100"
                        name="logging-type"
                        @change="updateStorage('meshLoggingType', $event.target.value)"
                      >
                        <option
                          selected
                          disabled
                        >
                          Select a CA&hellip;
                        </option>
                        <option
                          value="tcp"
                          :selected="(getStorageItem('meshLoggingType') === 'tcp') ? true : false"
                        >
                          TCP
                        </option>
                        <option
                          value="file"
                          :selected="(getStorageItem('meshLoggingType') === 'file') ? true : false"
                        >
                          File
                        </option>
                      </select>
                    </div>
                  </div>
                  <div class="form-line">
                    <div>
                      <label
                        for="backend-address"
                        class="k-input-label"
                      >
                        Address:
                      </label>
                    </div>
                    <div>
                      <input
                        id="backend-address"
                        type="text"
                        class="k-input w-100"
                        placeholder="127.0.0.1"
                        :value="getStorageItem('meshLoggingAddress')"
                        @change="updateStorage('meshLoggingAddress', $event.target.value)"
                      >
                    </div>
                  </div>
                  <div class="form-line">
                    <div>
                      <label
                        for="backend-format"
                        class="k-input-label"
                      >
                        Format:
                      </label>
                    </div>
                    <div>
                      <textarea
                        id="backend-format"
                        class="k-input w-100"
                        @change="updateStorage('meshLoggingBackendFormat', $event.target.value)"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </template>
          </KCard>
        </template>
        <template slot="tracing">
          <h3>
            Setup Tracing
          </h3>
          <p>
            You can setup as many tracing backends as you need that you can later
            use to log traffic via the &quot;TrafficTrace&quot; policy. In this
            wizard we allow you to configure one backend, but you can add more
            manually as you wish.
          </p>
          <KCard
            class="my-6 k-card--small"
            title="Tracing Configuration"
            has-shadow
          >
            <template slot="body">
              <form>
                <div class="form-line">
                  <div>
                    <label class="k-input-label">
                      Tracing
                    </label>
                  </div>
                  <div>
                    <label class="k-input-label mx-2">
                      <input
                        id="tracing-enabled"
                        value="enabled"
                        name="tracing"
                        type="radio"
                        class="k-input mr-2"
                        :checked="formConditions.tracingEnabled === true"
                        @change="updateStorage('meshTracingStatus', 'enabled'); formConditions.tracingEnabled = true"
                      >
                      <span>Enabled</span>
                    </label>
                    <label class="k-input-label mx-2">
                      <input
                        id="tracing-disabled"
                        value="disabled"
                        name="tracing"
                        type="radio"
                        class="k-input mr-2"
                        :checked="formConditions.tracingEnabled === false"
                        @change="updateStorage('meshTracingStatus', 'disabled'); formConditions.tracingEnabled = false"
                      >
                      <span>Disabled</span>
                    </label>
                  </div>
                </div>
                <div
                  v-if="formConditions.tracingEnabled === true"
                  class="form-group"
                >
                  <div class="form-line">
                    <div>
                      <label
                        for="tracing-backend-name"
                        class="k-input-label"
                      >
                        Backend name:
                      </label>
                    </div>
                    <div>
                      <input
                        id="tracing-backend-name"
                        type="text"
                        class="k-input w-100"
                        placeholder="your-tracing-backend-name"
                        :value="getStorageItem('meshTracingBackend')"
                        @change="updateStorage('meshTracingBackend', $event.target.value.replace(/ /g, '-').toLowerCase())"
                      >
                    </div>
                  </div>
                  <div class="form-line">
                    <div>
                      <label
                        for="tracing-type"
                        class="k-input-label"
                      >
                        Type:
                      </label>
                    </div>
                    <div>
                      <select
                        id="tracing-type"
                        class="k-input w-100"
                        name="logging-type"
                        @change="updateStorage('meshLoggingType', $event.target.value)"
                      >
                        <option
                          value="zipkin"
                          :selected="(getStorageItem('meshLoggingType') === 'zipkin') ? true : false"
                        >
                          Zipkin
                        </option>
                      </select>
                    </div>
                  </div>
                  <div class="form-line">
                    <div>
                      <label
                        for="tracing-sampling"
                        class="k-input-label"
                      >
                        Sampling:
                      </label>
                    </div>
                    <div>
                      <input
                        id="tracing-sampling"
                        type="number"
                        class="k-input w-100"
                        :value="getStorageItem('meshTracingSampling') || 99.9"
                        step="0.1"
                        @change="updateStorage('meshTracingSampling', $event.target.value)"
                      >
                    </div>
                  </div>
                  <div class="form-line">
                    <div>
                      <label
                        for="tracing-zipkin-url"
                        class="k-input-label"
                      >
                        Zipkin URL:
                      </label>
                    </div>
                    <div>
                      <input
                        id="tracing-zipkin-url"
                        type="text"
                        class="k-input w-100"
                        :value="getStorageItem('meshTracingZipkinURL')"
                        @change="updateStorage('meshTracingZipkinURL', $event.target.value)"
                      >
                    </div>
                  </div>
                </div>
              </form>
            </template>
          </KCard>
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
import updateStorage from '@/views/Wizard/mixins/updateStorage'
import StepSkeleton from '@/views/Wizard/components/StepSkeleton'

export default {
  metaInfo: {
    title: 'Create a new Mesh'
  },
  components: {
    StepSkeleton
  },
  mixins: [
    updateStorage
  ],
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
      ],
      formConditions: {
        mtlsEnabled: false,
        loggingEnabled: false,
        tracingEnabled: false
      }
    }
  },
  computed: {
    canAdvance () {
      // const query = this.$route.query
      // const name = query.name
      // const mtls = query.mtls

      // if (
      //   (undefined !== name && name.length > 0) &&
      //   (undefined !== mtls && mtls.length > 0)
      // ) {
      //   return true
      // } else {
      //   return false
      // }

      // conditions disabled for now because
      // this is a huge rabbit hole.
      return true
    },
    ...mapGetters({
      title: 'getTagline',
      version: 'getVersion'
    })
  }
}
</script>

<style lang="scss" scoped>
.wizard {

}

.wizard__content {

}
</style>
