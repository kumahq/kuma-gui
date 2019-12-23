<template>
  <div class="welcome welcome__step-1">
    <p class="lg">
      Kuma has been successfully installed, you’re one step away to build a
      modern cloud-native architecture!
    </p>

    <div class="app-setup">
      <h3 class="xl">
        Let's set up your app
      </h3>

      <div class="app-source-check">
        <div
          v-if="appSource
            && appSource === 'universal'
            || appSource === 'kubernetes'
            || appSource === 'k8s'"
          class="app-source-check__inner flex items-center"
        >
          <div class="app-source-check__icon px-4">
            <img
              v-if="appSource === 'universal'"
              src="@/assets/images/icon-universal-alt.png?external"
              alt="Kuma Universal Icon"
            >
            <img
              v-else-if="appSource === 'kubernetes' || appSource === 'k8s'"
              src="@/assets/images/icon-k8s.png?external"
              alt="Kuma Kubernetes Icon"
            >
          </div>
          <div class="app-source-check__content px-4">
            <p>Kuma is running on {{ appSource }}</p>
          </div>
          <div class="px-4">
            <img
              src="@/assets/images/icon-checkmark.svg?external"
              alt="Checkmark Icon"
            >
          </div>
        </div>
        <div
          v-else
          class="app-source-check--error"
        >
          <p>The app was unable to determine Kuma's environment.</p>
        </div>
      </div>

      <div
        v-if="tableDataLoadAttempted === false"
        class="dataplane-loading-state flex -mx-2 mt-8"
      >
        <div class="px-2">
          <KIcon
            icon="spinner"
            size="36"
            color="black"
          />
        </div>
        <div class="px-2">
          <p>
            Waiting for Dataplanes to connect&hellip;
          </p>
        </div>
      </div>
      <div
        v-else-if="tableData && tableDataIsEmpty === false"
        class="mt-8"
      >
        <h2 class="xl mb-2 pb-2">
          {{ dataplaneCountForTitle }} Dataplane(s) found, including:
        </h2>
        <div class="data-table-wrapper">
          <KTable :options="tableData">
            <template
              v-slot:status="{rowValue}"
            >
              <div
                class="entity-status"
                :class="{ 'is-offline': (rowValue === 'Offline' || rowValue === 'offline' || rowValue === false) }"
              >
                <span class="entity-status__dot" />
                <span class="entity-status__label">{{ rowValue }}</span>
              </div>
            </template>
          </KTable>
        </div>
        <p class="mt-4">
          <KButton
            :to="{ name: 'setup-complete' }"
            appearance="primary"
          >
            Next Step
          </KButton>
        </p>
      </div>
      <div
        v-else
        class="dataplane-fallback-wrapper"
      >
        <div class="dataplane-fallback">
          <div class="dataplane-fallback__inner flex -mx-4">
            <div class="dataplane-fallback__icon px-4">
              <img
                src="@/assets/images/icon-dataplane.svg?external"
                alt="Dataplane Icon"
              >
            </div>
            <div class="dataplane-fallback__content px-4">
              <h3 class="dataplane-fallback__title mb-2 pb-2">
                No Dataplanes detected.
              </h3>
              <p class="mb-2">
                To bring your applications into Kuma Service Mesh,
                you need to deploy dataplanes (also known as Sidecar Proxies)
                next to them.
              </p>
            </div>
          </div>
        </div>
        <!-- .dataplane-fallback -->
        <div class="dataplane-walkthrough my-4">
          <!-- kubernetes instructions -->
          <div
            v-if="appSource
              && appSource === 'kubernetes'
              || appSource === 'k8s'"
          >
            <h3 class="xl mb-2">
              Adding New Dataplanes on Kubernetes
            </h3>
            <p class="mb-2">
              On Kubernetes, Kuma can automatically deploy dataplanes
              (also known as Sidecar Proxies) next to your applications.
            </p>
            <p>
              First, you need to enable automatic sidecar injection at a Namespace level:
            </p>
            <p>
              <code>
                <pre>$ kubectl label namespace [YOUR_NAMESPACE] kuma.io/sidecar-injection=enabled</pre>
              </code>
            </p>
            <p>
              Then, you need to recreate application Pods:
            </p>
            <p>
              <code>
                <pre>$ kubectl -n [YOUR_NAMESPACE] delete pods --all</pre>
              </code>
            </p>
          </div>
          <!-- universal instructions -->
          <div v-else>
            <h3 class="xl mb-2">
              Adding New Dataplanes on Universal
            </h3>
            <p class="mb-2">
              First, create a Dataplane resource to describe service(s) provided by your app:
            </p>
            <p>
              <code>
                <pre>
$ echo "type: Dataplane
mesh: default
name: dp-echo-1
networking:
  inbound:
  - interface: 127.0.0.1:10000:9000
    tags:
      service: echo" | kumactl apply -f -</pre>
              </code>
            </p>
            <p>
              Next, generate an identity token for the dataplane:
            </p>
            <p>
              <code>
                <pre>$ kumactl generate dataplane-token --dataplane=dp-echo-1 > /tmp/kuma-dp-echo-1</pre>
              </code>
            </p>
            <p>
              Lastly, start the dataplane:
            </p>
            <p>
              <code>
                <pre>
$ kuma-dp run \
  --name=dp-echo-1 \
  --mesh=default \
  --cp-address=http://127.0.0.1:5681 \
  --dataplane-token-file=/tmp/kuma-dp-echo-1</pre>
              </code>
            </p>
          </div>

          <KButton
            appearance="primary"
            class="mt-4"
            @click="reScanForDataplanes()"
          >
            Re-Scan for Dataplanes
          </KButton>
          </p>
        </div>
      </div>
    </div>
    <!-- .app-source-check -->

    <!-- <demo-app /> -->
  </div>
</template>

<script>
import axios from 'axios'
import DemoApp from './components/DemoApp'

export default {
  name: 'OnboardingStep1',
  metaInfo: {
    title: 'Welcome to Kuma!'
  },
  components: {
    DemoApp
  },
  data () {
    return {
      appSource: false,
      appSourceError: false,
      tableDataLoadDelay: 1500,
      tableDataIsEmpty: true,
      tableDataLoadAttempted: false,
      tableDataDataplaneCount: null,
      tableData: {
        headers: [
          { label: 'Status', key: 'status' },
          { label: 'Dataplane', key: 'name' },
          { label: 'Mesh', key: 'mesh' }
        ],
        data: []
      }
    }
  },
  computed: {
    dataplaneCountForTitle () {
      const count = this.tableDataDataplaneCount
      if (count && count > 10) {
        return '10+'
      } else {
        return count
      }
    }
  },
  beforeMount () {
    this.bootstrap()
  },
  methods: {
    bootstrap () {
      this.isLoading = true
      this.isEmpty = false

      this.getAppType()
      this.getDataplaneTableData()
    },

    reScanForDataplanes () {
      this.tableDataIsEmpty = false
      this.tableDataLoadAttempted = false

      setTimeout(() => {
        this.getDataplaneTableData()
        this.tableDataLoadAttempted = true
      }, this.tableDataLoadDelay)
    },

    getDataplaneTableData () {
      this.$store.dispatch('getAllDataplanes')
        .then(() => {
          const dataplanes = Object.values(this.$store.getters.getDataplanesList)

          if (dataplanes && dataplanes.length > 0) {
            this.tableDataDataplaneCount = dataplanes.length
            this.tableData.data = []
            this.tableDataLoadAttempted = false

            dataplanes.slice(0, 10).map(val => {
              this.tableData.data.push(val)
            })

            this.tableDataIsEmpty = false

            setTimeout(() => {
              this.tableDataLoadAttempted = true
            }, this.tableDataLoadDelay)
          } else {
            this.tableDataLoadAttempted = true
            this.tableDataIsEmpty = true
          }
        })
    },

    getAppType () {
      axios
        .get(process.env.VUE_APP_KUMA_CONFIG)
        .then(response => {
          const kumaEnv = response.data.environment

          if (response.status === 200 && kumaEnv && kumaEnv.length) {
            this.appSource = kumaEnv
          } else {
            this.appSource = null
          }
        })
        .catch(error => {
          this.appSource = null
          console.error(error)
        })
    }
  }
}
</script>

<style lang="scss">
@mixin styledPanel {
  background-color: #F2F5F7;
  padding: var(--spacing-lg);
  border-radius: 4px;
  margin-top: var(--spacing-md);
}

@mixin styledPanelSmall {
  padding: var(--spacing-sm) var(--spacing-lg);
  margin-top: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  border-radius: 4px;
}

.app-setup {
  padding: var(--spacing-md) 0;
  margin: var(--spacing-md) 0;
  border-top: 1px solid var(--tblack-10);
  border-bottom: 1px solid var(--tblack-10);
}

.app-source-check {

}

.app-source-check--error {
  @include styledPanelSmall;

  background-color: var(--red-lighter);
  color: var(--red-dark);
}

.app-source-check__inner {
  @include styledPanelSmall;

  background-color: var(--blue-lighter);

  > *:first-child {
    flex: 0 0 16%;
  }

  > *:last-child {
    margin-left: auto;
  }
}

.dataplane-fallback-wrapper {

}

.dataplane-fallback {
  @include styledPanel;
}

.dataplane-fallback__icon {
  flex: 0 0 12%;

  img {
    width: 100%;
    height: auto;
  }
}

.dataplane-fallback__title {
  border-bottom: 1px solid var(--tblack-10);
}

.data-table-wrapper {
  overflow: hidden;
  border: 1px solid var(--gray-4);
  background: none;
  border-radius: 4px;

  .k-table thead {
    background-color: var(--gray-5);
    border-top: 0;
  }
}

.dataplane-walkthrough {

  p:not(:last-of-type) {
    margin-bottom: 16px;
  }

  pre {
    white-space: pre-wrap;
  }

  code {
    @include styledPanel;

    word-break: break-word !important;

    display: block;
    font-family: var(--font-family-mono);
  }
}

.dataplane-loading-state {

}
</style>
