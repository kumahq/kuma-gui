<template>
  <TabsWidget
    :tabs="filteredTabs"
    initial-tab-override="overview"
  >
    <template #tabHeader>
      <div>
        <h3>
          DPP: {{ dataPlane.name }}
        </h3>
      </div>

      <div>
        <EntityURLControl
          :name="dataPlane.name"
          :mesh="dataPlane.mesh"
        />
      </div>
    </template>

    <template #overview>
      <LabelList>
        <div>
          <ul>
            <li
              v-for="(value, prop) in processedDataPlane"
              :key="prop"
            >
              <h4>{{ prop }}</h4>

              <div v-if="prop === 'status' && typeof value !== 'string'">
                <div
                  class="entity-status"
                  :class="{
                    'is-offline': value.status.toLowerCase() === 'offline',
                    'is-online': value.status.toLowerCase() === 'online',
                    'is-degraded': value.status.toLowerCase() === 'partially degraded',
                    'is-not-available': value.status.toLowerCase() === 'not available',
                  }"
                >
                  <span>{{ value.status }}</span>
                </div>

                <div
                  v-for="(reason, index) in value.reason"
                  :key="index"
                  class="reason"
                >
                  {{ reason }}
                </div>
              </div>

              <div v-else>
                {{ value }}
              </div>
            </li>
          </ul>
        </div>

        <div>
          <template v-if="dataPlaneTags.length > 0">
            <h4>Tags</h4>

            <p>
              <span
                v-for="(tag, index) in dataPlaneTags"
                :key="index"
                class="tag-cols"
              >
                <span>
                  {{ tag.label }}:
                </span>

                <span>
                  {{ tag.value }}
                </span>
              </span>
            </p>
          </template>

          <template v-if="dataPlaneVersions">
            <h4>Versions</h4>

            <p>
              <span
                v-for="(version, dependency) in dataPlaneVersions"
                :key="dependency"
                class="tag-cols"
              >
                <span>
                  {{ dependency }}:
                </span>

                <span>
                  {{ version }}
                </span>
              </span>
            </p>
          </template>
        </div>
      </LabelList>

      <div class="config-wrapper">
        <YamlView
          id="code-block-data-plane"
          :content="rawDataPlane"
          is-searchable
        />
      </div>
    </template>

    <template #insights>
      <StatusInfo :is-empty="insightSubscriptions.length === 0">
        <KCard border-variant="noBorder">
          <template #body>
            <AccordionList :initially-open="0">
              <AccordionItem
                v-for="(insight, key) in insightSubscriptions"
                :key="key"
              >
                <template #accordion-header>
                  <SubscriptionHeader :details="insight" />
                </template>

                <template #accordion-content>
                  <SubscriptionDetails
                    :details="insight"
                    is-discovery-subscription
                  />
                </template>
              </AccordionItem>
            </AccordionList>
          </template>
        </KCard>
      </StatusInfo>
    </template>

    <template #dpp-policies>
      <DataplanePolicies
        :mesh="dataPlane.mesh"
        :dpp-name="dataPlane.name"
      />
    </template>

    <template #xds-configuration>
      <EnvoyData
        data-path="xds"
        :mesh="dataPlane.mesh"
        :dpp-name="dataPlane.name"
        query-key="envoy-data-data-plane"
      />
    </template>

    <template #envoy-stats>
      <EnvoyData
        data-path="stats"
        :mesh="dataPlane.mesh"
        :dpp-name="dataPlane.name"
        query-key="envoy-data-data-plane"
      />
    </template>

    <template #envoy-clusters>
      <EnvoyData
        data-path="clusters"
        :mesh="dataPlane.mesh"
        :dpp-name="dataPlane.name"
        query-key="envoy-data-data-plane"
      />
    </template>

    <template #mtls>
      <LabelList>
        <ul v-if="mtlsData !== null">
          <li
            v-for="(val, key) in mtlsData"
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
          <template #alertMessage>
            This data plane proxy does not yet have mTLS configured —
            <a
              :href="`https://kuma.io/docs/${kumaDocsVersion}/documentation/security/#certificates`"
              class="external-link"
              target="_blank"
            >
              Learn About Certificates in {{ PRODUCT_NAME }}
            </a>
          </template>
        </KAlert>
      </LabelList>
    </template>

    <template #warnings>
      <WarningsWidget :warnings="warnings" />
    </template>
  </TabsWidget>
</template>

<script lang="ts" setup>
import { computed, ref, PropType } from 'vue'
import { KCard, KAlert } from '@kong/kongponents'

import {
  Compatibility,
  DataPlane,
  DataPlaneOverview,
} from '@/types'
import {
  compatibilityKind,
  COMPATIBLE,
  dpTags,
  getStatus,
  getVersions,
  INCOMPATIBLE_WRONG_FORMAT,
  INCOMPATIBLE_ZONE_CP_AND_KUMA_DP_VERSIONS,
  parseMTLSData,
} from '@/dataplane'
import { KUMA_ZONE_TAG_NAME, PRODUCT_NAME } from '@/consts'
import { stripTimes } from '@/helpers'
import { useStore } from '@/store/store'
import AccordionItem from '@/components/Accordion/AccordionItem.vue'
import AccordionList from '@/components/Accordion/AccordionList.vue'
import DataplanePolicies from '@/components/DataplanePolicies/DataplanePolicies.vue'
import EntityURLControl from '@/components/Utils/EntityURLControl.vue'
import EnvoyData from '@/components/EnvoyData/EnvoyData.vue'
import LabelList from '@/components/Utils/LabelList.vue'
import StatusInfo from '@/components/Utils/StatusInfo.vue'
import SubscriptionDetails from '@/views/Entities/components/SubscriptionDetails.vue'
import SubscriptionHeader from '@/views/Entities/components/SubscriptionHeader.vue'
import TabsWidget from '@/components/Utils/TabsWidget.vue'
import WarningsWidget from '@/views/Entities/components/WarningsWidget.vue'
import YamlView from '@/app/common/YamlView.vue'

const store = useStore()

const props = defineProps({
  dataPlane: {
    type: Object as PropType<DataPlane>,
    required: true,
  },

  dataPlaneOverview: {
    type: Object as PropType<DataPlaneOverview>,
    required: true,
  },
})

const tabs = [
  {
    hash: '#overview',
    title: 'Overview',
  },
  {
    hash: '#insights',
    title: 'DPP Insights',
  },
  {
    hash: '#dpp-policies',
    title: 'Policies',
  },
  {
    hash: '#xds-configuration',
    title: 'XDS Configuration',
  },
  {
    hash: '#envoy-stats',
    title: 'Stats',
  },
  {
    hash: '#envoy-clusters',
    title: 'Clusters',
  },
  {
    hash: '#mtls',
    title: 'Certificate Insights',
  },
  {
    hash: '#warnings',
    title: 'Warnings',
  },
]

const warnings = ref<Compatibility[]>([])

const processedDataPlane = computed(() => {
  const { type, name, mesh } = props.dataPlane
  const status = getStatus(props.dataPlane, props.dataPlaneOverview.dataplaneInsight)

  return {
    type,
    name,
    mesh,
    status,
  }
})

const dataPlaneTags = computed(() => dpTags(props.dataPlane))
const dataPlaneVersions = computed(() => getVersions(props.dataPlaneOverview.dataplaneInsight))
const rawDataPlane = computed(() => stripTimes(props.dataPlane))
const mtlsData = computed(() => parseMTLSData(props.dataPlaneOverview))
const insightSubscriptions = computed(() => {
  const subscriptions = Array.from(props.dataPlaneOverview.dataplaneInsight.subscriptions)

  subscriptions.reverse()

  return subscriptions
})

const kumaDocsVersion = computed(() => {
  const storedVersion = store.getters.getKumaDocsVersion

  return storedVersion !== null ? storedVersion : 'latest'
})

const filteredTabs = computed(() => warnings.value.length === 0 ? tabs.filter((tab) => tab.hash !== '#warnings') : tabs)

function setWarnings() {
  const subscriptions = props.dataPlaneOverview.dataplaneInsight.subscriptions

  if (subscriptions.length === 0 || !('version' in subscriptions[0])) {
    return
  }

  const version = subscriptions[0].version

  if (version && version.kumaDp && version.envoy) {
    const compatibility = compatibilityKind(version)

    if (compatibility.kind !== COMPATIBLE && compatibility.kind !== INCOMPATIBLE_WRONG_FORMAT) {
      warnings.value.push(compatibility)
    }
  }

  const isMulticluster = store.getters['config/getMulticlusterStatus']

  if (isMulticluster && version) {
    const tags = dpTags(props.dataPlane)
    const zoneTag = tags.find(tag => tag.label === KUMA_ZONE_TAG_NAME)

    if (zoneTag && typeof version.kumaDp.kumaCpCompatible === 'boolean' && !version.kumaDp.kumaCpCompatible) {
      warnings.value.push({
        kind: INCOMPATIBLE_ZONE_CP_AND_KUMA_DP_VERSIONS,
        payload: {
          kumaDp: version.kumaDp.version,
        },
      })
    }
  }
}

setWarnings()
</script>

<style lang="scss" scoped>
.reason {
  margin-left: var(--spacing-md);
  margin-bottom: var(--spacing-xxs);
  margin-top: var(--spacing-xxs);
}

.config-wrapper {
  padding-right: var(--spacing-md);
  padding-left: var(--spacing-md);
  padding-bottom: var(--spacing-md);
}
</style>
