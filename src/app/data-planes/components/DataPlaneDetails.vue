<template>
  <TabsWidget :tabs="filteredTabs">
    <template #overview>
      <DefinitionList>
        <DefinitionListItem :term="t('http.api.property.name')">
          <TextWithCopyButton :text="props.dataplaneOverview.name">
            <RouterLink
              :to="{
                name: 'data-plane-detail-view',
                params: {
                  mesh: props.dataplaneOverview.mesh,
                  dataPlane: props.dataplaneOverview.name,
                },
              }"
            >
              {{ props.dataplaneOverview.name }}
            </RouterLink>
          </TextWithCopyButton>
        </DefinitionListItem>

        <DefinitionListItem
          v-if="dataPlaneTags.length > 0"
          term="Tags"
        >
          <TagList :tags="dataPlaneTags" />
        </DefinitionListItem>

        <DefinitionListItem
          v-if="statusWithReason.status"
          term="Status"
        >
          <StatusBadge :status="statusWithReason.status" />
        </DefinitionListItem>

        <DefinitionListItem
          v-if="statusWithReason.reason.length > 0"
          term="Reason"
        >
          <div
            v-for="(reason, index) in statusWithReason.reason"
            :key="index"
            class="reason"
          >
            {{ reason }}
          </div>
        </DefinitionListItem>

        <DefinitionListItem
          v-if="dataPlaneVersions !== null"
          term="Dependencies"
        >
          <ul>
            <li
              v-for="(version, dependency) in dataPlaneVersions"
              :key="dependency"
              class="tag-cols"
            >
              {{ dependency }}: {{ version }}
            </li>
          </ul>
        </DefinitionListItem>
      </DefinitionList>

      <ResourceCodeBlock
        id="code-block-data-plane"
        class="mt-4"
        :resource="props.dataplaneOverview"
        :resource-fetcher="fetchDataPlaneProxy"
        is-searchable
      />
    </template>

    <template #insights>
      <StatusInfo :is-empty="insightSubscriptions.length === 0">
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
      </StatusInfo>
    </template>

    <template #dpp-policies>
      <DataplanePolicies :dataplane-overview="dataplaneOverview" />
    </template>

    <template #xds-configuration>
      <EnvoyData
        data-path="xds"
        :mesh="dataplaneOverview.mesh"
        :dpp-name="dataplaneOverview.name"
        query-key="envoy-data-data-plane"
      />
    </template>

    <template #envoy-stats>
      <EnvoyData
        data-path="stats"
        :mesh="dataplaneOverview.mesh"
        :dpp-name="dataplaneOverview.name"
        query-key="envoy-data-data-plane"
      />
    </template>

    <template #envoy-clusters>
      <EnvoyData
        data-path="clusters"
        :mesh="dataplaneOverview.mesh"
        :dpp-name="dataplaneOverview.name"
        query-key="envoy-data-data-plane"
      />
    </template>

    <template #mtls>
      <KAlert
        v-if="mtlsData === null"
        appearance="danger"
      >
        <template #alertMessage>
          This data plane proxy does not yet have mTLS configured —
          <a
            :href="t('data-planes.href.docs.mutual-tls')"
            class="external-link"
            target="_blank"
          >
            Learn About Certificates in {{ t('common.product.name') }}
          </a>
        </template>
      </KAlert>
      <DefinitionList v-else>
        <DefinitionListItem
          v-for="(value, property) in mtlsData"
          :key="property"
          :term="t(`http.api.property.${property}`)"
        >
          {{ value }}
        </DefinitionListItem>
      </DefinitionList>
    </template>

    <template #warnings>
      <WarningsWidget
        v-if="warnings.length > 0"
        :warnings="warnings"
      />
    </template>
  </TabsWidget>
</template>

<script lang="ts" setup>
import { KAlert } from '@kong/kongponents'
import { computed, ref, PropType } from 'vue'

import DataplanePolicies from './DataplanePolicies.vue'
import AccordionItem from '@/app/common/AccordionItem.vue'
import AccordionList from '@/app/common/AccordionList.vue'
import DefinitionList from '@/app/common/DefinitionList.vue'
import DefinitionListItem from '@/app/common/DefinitionListItem.vue'
import EnvoyData from '@/app/common/EnvoyData.vue'
import ResourceCodeBlock from '@/app/common/ResourceCodeBlock.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import StatusInfo from '@/app/common/StatusInfo.vue'
import SubscriptionDetails from '@/app/common/subscriptions/SubscriptionDetails.vue'
import SubscriptionHeader from '@/app/common/subscriptions/SubscriptionHeader.vue'
import TabsWidget from '@/app/common/TabsWidget.vue'
import TagList from '@/app/common/TagList.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import WarningsWidget from '@/app/common/warnings/WarningsWidget.vue'
import { KUMA_ZONE_TAG_NAME } from '@/constants'
import { useStore } from '@/store/store'
import type { SingleResourceParameters } from '@/types/api.d'
import {
  Compatibility,
  DataPlaneOverview,
} from '@/types/index.d'
import { useI18n, useKumaApi } from '@/utilities'
import {
  compatibilityKind,
  COMPATIBLE,
  dpTags,
  getStatusAndReason,
  getVersions,
  INCOMPATIBLE_WRONG_FORMAT,
  INCOMPATIBLE_ZONE_CP_AND_KUMA_DP_VERSIONS,
  parseMTLSData,
} from '@/utilities/dataplane'

const { t, formatIsoDate } = useI18n()

const kumaApi = useKumaApi()
const store = useStore()

const props = defineProps({
  dataplaneOverview: {
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

const statusWithReason = computed(() => getStatusAndReason(props.dataplaneOverview.dataplane, props.dataplaneOverview.dataplaneInsight))
const dataPlaneTags = computed(() => dpTags(props.dataplaneOverview.dataplane))
const dataPlaneVersions = computed(() => getVersions(props.dataplaneOverview.dataplaneInsight))
const mtlsData = computed(() => parseMTLSData(props.dataplaneOverview, formatIsoDate))
const insightSubscriptions = computed(() => {
  const subscriptions = Array.from(props.dataplaneOverview.dataplaneInsight?.subscriptions ?? [])

  subscriptions.reverse()

  return subscriptions
})

const filteredTabs = computed(() => warnings.value.length === 0 ? tabs.filter((tab) => tab.hash !== '#warnings') : tabs)

function setWarnings() {
  const subscriptions = props.dataplaneOverview.dataplaneInsight?.subscriptions ?? []

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
    const tags = dpTags(props.dataplaneOverview.dataplane)
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

async function fetchDataPlaneProxy(params?: SingleResourceParameters) {
  const { mesh, name } = props.dataplaneOverview
  return await kumaApi.getDataplaneFromMesh({ mesh, name }, params)
}
</script>

<style lang="scss" scoped>
.entity-heading {
  font-size: inherit;
  font-weight: var(--font-weight-regular);
}

.reason {
  margin-left: var(--spacing-md);
  margin-bottom: var(--spacing-xxs);
  margin-top: var(--spacing-xxs);
}

.tag-cols {
  display: grid;
  grid-auto-flow: column dense;
  grid-template-columns: 1fr 2fr;

  span {
    display: inline-block;
    padding: var(--spacing-xs);
  }

  span:first-of-type {
    font-weight: var(--font-weight-semi-bold);
  }
}
</style>
