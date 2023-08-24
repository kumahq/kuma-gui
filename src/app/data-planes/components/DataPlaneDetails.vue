<template>
  <TabsWidget :tabs="TABS">
    <template #overview>
      <div class="stack">
        <WarningsWidget
          v-if="warnings.length > 0"
          :warnings="warnings"
          data-testid="data-plane-warnings"
        />

        <KCard>
          <template #body>
            <div
              class="columns"
              style="--columns: 4;"
            >
              <DefinitionCard>
                <template #title>
                  {{ t('http.api.property.status') }}
                </template>

                <template #body>
                  <div class="status-with-reason">
                    <StatusBadge :status="statusWithReason.status" />

                    <KTooltip
                      v-if="statusWithReason.reason.length > 0"
                      :label="statusWithReason.reason.join(', ')"
                      class="reason-tooltip"
                    >
                      <KIcon
                        icon="info"
                        size="20"
                        hide-title
                      />
                    </KTooltip>
                  </div>
                </template>
              </DefinitionCard>

              <DefinitionCard>
                <template #title>
                  {{ t('http.api.property.name') }}
                </template>

                <template #body>
                  <TextWithCopyButton :text="props.dataplaneOverview.name" />
                </template>
              </DefinitionCard>

              <DefinitionCard>
                <template #title>
                  {{ t('http.api.property.tags') }}
                </template>

                <template #body>
                  <TagList
                    v-if="dataPlaneTags.length > 0"
                    :tags="dataPlaneTags"
                  />

                  <template v-else>
                    {{ t('common.detail.none') }}
                  </template>
                </template>
              </DefinitionCard>

              <DefinitionCard>
                <template #title>
                  {{ t('http.api.property.dependencies') }}
                </template>

                <template #body>
                  <TagList
                    v-if="dataPlaneVersions !== null"
                    :tags="dataPlaneVersions"
                  />

                  <template v-else>
                    {{ t('common.detail.none') }}
                  </template>
                </template>
              </DefinitionCard>
            </div>
          </template>
        </KCard>

        <div>
          <h3>{{ t('data-planes.detail.mtls') }}</h3>

          <KAlert
            v-if="mtlsData === null"
            class="mt-4"
            appearance="danger"
          >
            <template #alertMessage>
              {{ t('data-planes.detail.no_mtls') }} —
              <a
                :href="t('data-planes.href.docs.mutual-tls')"
                class="external-link"
                target="_blank"
              >
                {{ t('data-planes.detail.no_mtls_learn_more', { product: t('common.product.name') }) }}
              </a>
            </template>
          </KAlert>

          <KCard
            v-else
            class="mt-4"
          >
            <template #body>
              <div
                class="columns"
                style="--columns: 3;"
              >
                <DefinitionCard>
                  <template #title>
                    {{ t('http.api.property.certificateExpirationTime') }}
                  </template>

                  <template #body>
                    {{ mtlsData.certificateExpirationTime }}
                  </template>
                </DefinitionCard>

                <DefinitionCard>
                  <template #title>
                    {{ t('http.api.property.lastCertificateRegeneration') }}
                  </template>

                  <template #body>
                    {{ mtlsData.lastCertificateRegeneration }}
                  </template>
                </DefinitionCard>

                <DefinitionCard>
                  <template #title>
                    {{ t('http.api.property.certificateRegenerations') }}
                  </template>

                  <template #body>
                    {{ mtlsData.certificateRegenerations }}
                  </template>
                </DefinitionCard>
              </div>
            </template>
          </KCard>
        </div>

        <div>
          <DataSource
            v-slot="{ data, error }: DataplaneSource"
            :src="`/meshes/${route.params.mesh}/dataplanes/${route.params.dataPlane}`"
          >
            <ErrorBlock
              v-if="error"
              :error="error"
            />

            <LoadingBlock v-else-if="data === undefined" />

            <template v-else>
              <h3>{{ t('data-planes.detail.configuration') }}</h3>

              <ResourceCodeBlock
                id="code-block-data-plane"
                class="mt-4"
                :resource="data"
                :resource-fetcher="fetchDataPlaneProxy"
                is-searchable
              />
            </template>
          </DataSource>
        </div>
      </div>
    </template>

    <template #insights>
      <KCard>
        <template #body>
          <StatusInfo :is-empty="insightSubscriptions.length === 0">
            <AccordionList :initially-open="0">
              <AccordionItem
                v-for="(subscription, key) in insightSubscriptions"
                :key="key"
              >
                <template #accordion-header>
                  <SubscriptionHeader :subscription="subscription" />
                </template>

                <template #accordion-content>
                  <SubscriptionDetails
                    :subscription="subscription"
                    is-discovery-subscription
                  />
                </template>
              </AccordionItem>
            </AccordionList>
          </StatusInfo>
        </template>
      </KCard>
    </template>

    <template #dpp-policies>
      <KCard>
        <template #body>
          <DataSource
            v-slot="{ data: policyTypesData, error: policyTypesError }: PolicyTypeCollectionSource"
            :src="`/*/policy-types`"
          >
            <ErrorBlock
              v-if="policyTypesError"
              :error="policyTypesError"
            />

            <LoadingBlock v-else-if="policyTypesData === undefined" />

            <EmptyBlock v-else-if="policyTypesData.policies.length === 0" />

            <DataplanePolicies
              v-else
              :dataplane-overview="dataplaneOverview"
              :policy-types="policyTypesData.policies"
            />
          </DataSource>
        </template>
      </KCard>
    </template>

    <template #xds-configuration>
      <KCard>
        <template #body>
          <EnvoyData
            :src="`/meshes/${props.dataplaneOverview.mesh}/dataplanes/${props.dataplaneOverview.name}/data-path/xds`"
            query-key="envoy-data-xds-data-plane"
          />
        </template>
      </KCard>
    </template>

    <template #envoy-stats>
      <KCard>
        <template #body>
          <EnvoyData
            :src="`/meshes/${props.dataplaneOverview.mesh}/dataplanes/${props.dataplaneOverview.name}/data-path/stats`"
            query-key="envoy-data-stats-data-plane"
          />
        </template>
      </KCard>
    </template>

    <template #envoy-clusters>
      <KCard>
        <template #body>
          <EnvoyData
            :src="`/meshes/${props.dataplaneOverview.mesh}/dataplanes/${props.dataplaneOverview.name}/data-path/clusters`"
            query-key="envoy-data-clusters-data-plane"
          />
        </template>
      </KCard>
    </template>
  </TabsWidget>
</template>

<script lang="ts" setup>
import { KAlert, KCard, KIcon, KTooltip } from '@kong/kongponents'
import { computed, PropType } from 'vue'
import { useRoute } from 'vue-router'

import DataplanePolicies from './DataplanePolicies.vue'
import type { DataplaneSource } from '../sources'
import DataSource from '@/app/application/components/data-source/DataSource.vue'
import AccordionItem from '@/app/common/AccordionItem.vue'
import AccordionList from '@/app/common/AccordionList.vue'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import EnvoyData from '@/app/common/EnvoyData.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import ResourceCodeBlock from '@/app/common/ResourceCodeBlock.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import StatusInfo from '@/app/common/StatusInfo.vue'
import SubscriptionDetails from '@/app/common/subscriptions/SubscriptionDetails.vue'
import SubscriptionHeader from '@/app/common/subscriptions/SubscriptionHeader.vue'
import TabsWidget from '@/app/common/TabsWidget.vue'
import TagList from '@/app/common/TagList.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import WarningsWidget from '@/app/common/warnings/WarningsWidget.vue'
import { PolicyTypeCollectionSource } from '@/app/policies/sources'
import { KUMA_ZONE_TAG_NAME } from '@/constants'
import { useStore } from '@/store/store'
import type { SingleResourceParameters } from '@/types/api.d'
import { Compatibility, DataPlaneOverview } from '@/types/index.d'
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
const route = useRoute()
const store = useStore()

const props = defineProps({
  dataplaneOverview: {
    type: Object as PropType<DataPlaneOverview>,
    required: true,
  },
})

const TABS = [
  {
    hash: '#overview',
    title: t('data-planes.routes.item.tabs.overview'),
  },
  {
    hash: '#insights',
    title: t('data-planes.routes.item.tabs.insights'),
  },
  {
    hash: '#dpp-policies',
    title: t('data-planes.routes.item.tabs.policies'),
  },
  {
    hash: '#xds-configuration',
    title: t('data-planes.routes.item.tabs.xds_configuration'),
  },
  {
    hash: '#envoy-stats',
    title: t('data-planes.routes.item.tabs.stats'),
  },
  {
    hash: '#envoy-clusters',
    title: t('data-planes.routes.item.tabs.clusters'),
  },
]

const statusWithReason = computed(() => getStatusAndReason(props.dataplaneOverview.dataplane, props.dataplaneOverview.dataplaneInsight))
const dataPlaneTags = computed(() => dpTags(props.dataplaneOverview.dataplane))
const dataPlaneVersions = computed(() => getVersions(props.dataplaneOverview.dataplaneInsight))
const mtlsData = computed(() => parseMTLSData(props.dataplaneOverview, formatIsoDate))
const insightSubscriptions = computed(() => {
  const subscriptions = Array.from(props.dataplaneOverview.dataplaneInsight?.subscriptions ?? [])

  subscriptions.reverse()

  return subscriptions
})

const warnings = computed(() => {
  const subscriptions = props.dataplaneOverview.dataplaneInsight?.subscriptions ?? []
  if (subscriptions.length === 0) {
    return []
  }

  const lastSubscription = subscriptions[subscriptions.length - 1]
  if (!('version' in lastSubscription) || !lastSubscription.version) {
    return []
  }

  const warnings: Compatibility[] = []
  const version = lastSubscription.version

  if (version.kumaDp && version.envoy) {
    const compatibility = compatibilityKind(version)

    if (compatibility.kind !== COMPATIBLE && compatibility.kind !== INCOMPATIBLE_WRONG_FORMAT) {
      warnings.push(compatibility)
    }
  }

  if (store.getters['config/getMulticlusterStatus']) {
    const tags = dpTags(props.dataplaneOverview.dataplane)
    const zoneTag = tags.find(tag => tag.label === KUMA_ZONE_TAG_NAME)

    if (zoneTag && typeof version.kumaDp.kumaCpCompatible === 'boolean' && !version.kumaDp.kumaCpCompatible) {
      warnings.push({
        kind: INCOMPATIBLE_ZONE_CP_AND_KUMA_DP_VERSIONS,
        payload: {
          kumaDp: version.kumaDp.version,
        },
      })
    }
  }

  return warnings
})

async function fetchDataPlaneProxy(params?: SingleResourceParameters) {
  const { mesh, name } = props.dataplaneOverview
  return await kumaApi.getDataplaneFromMesh({ mesh, name }, params)
}
</script>

<style lang="scss" scoped>
.status-with-reason {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}
</style>

<style lang="scss">
.reason-tooltip .kong-icon {
  display: flex;
  align-items: center;
}
</style>
