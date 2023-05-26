<template>
  <KCard>
    <template #body>
      <div class="entity-section-list">
        <section>
          <h3
            class="entity-title"
            data-testid="data-plane-proxy-title"
          >
            <span>
              DPP:

              <TextWithCopyButton :text="dataPlaneOverview.name">
                <router-link :to="detailViewRoute">
                  {{ dataPlaneOverview.name }}
                </router-link>
              </TextWithCopyButton>
            </span>

            <StatusBadge :status="status" />
          </h3>

          <DefinitionList class="mt-4">
            <DefinitionListItem
              v-if="dataPlaneTags !== null"
              term="Tags"
            >
              <TagList :tags="dataPlaneTags" />
            </DefinitionListItem>

            <DefinitionListItem
              v-if="dependencies.length > 0"
              term="Dependencies"
            >
              <ul>
                <li
                  v-for="(dependency, index) in dependencies"
                  :key="index"
                >
                  {{ dependency.name }}: {{ dependency.version }}
                </li>
              </ul>

              <template v-if="warnings.length > 0">
                <h5 class="mt-2 heading-with-icon">
                  Warnings

                  <KIcon
                    class="ml-1"
                    icon="warning"
                    color="var(--black-500)"
                    secondary-color="var(--yellow-300)"
                    size="20"
                  />
                </h5>

                <p
                  v-for="(warning, index) in warnings"
                  :key="index"
                >
                  {{ warning }}
                </p>
              </template>
            </DefinitionListItem>
          </DefinitionList>
        </section>

        <section v-if="subscriptionWrappers.length > 0">
          <h4>Insights</h4>

          <div class="block-list">
            <div
              v-for="(subscriptionWrapper, index) in subscriptionWrappers"
              :key="index"
            >
              <DefinitionList>
                <DefinitionListItem
                  term="Connect time"
                  :data-testid="`data-plane-connect-time-${index}`"
                >
                  {{ subscriptionWrapper.formattedConnectDate }}
                </DefinitionListItem>

                <DefinitionListItem
                  term="Disconnect time"
                  :data-testid="`data-plane-disconnect-time-${index}`"
                >
                  {{ subscriptionWrapper.formattedDisconnectDate }}
                </DefinitionListItem>

                <DefinitionListItem
                  :term="t('http.api.property.controlPlaneInstanceId')"
                >
                  {{ subscriptionWrapper.subscription.controlPlaneInstanceId }}
                </DefinitionListItem>
              </DefinitionList>

              <details
                v-if="subscriptionWrapper.statuses.length > 0"
                class="mt-2"
              >
                <summary>
                  Responses (acknowledged / sent)
                </summary>

                <DefinitionList>
                  <DefinitionListItem
                    v-for="(subscriptionStatus, subscriptionStatusIndex) in subscriptionWrapper.statuses"
                    :key="`${index}-${subscriptionStatusIndex}`"
                    :term="subscriptionStatus.type"
                    :data-testid="`data-plane-subscription-status-${index}-${subscriptionStatusIndex}`"
                  >
                    {{ subscriptionStatus.ratio }}
                  </DefinitionListItem>
                </DefinitionList>
              </details>
            </div>
          </div>
        </section>

        <ResourceCodeBlock
          id="code-block-data-plane-summary"
          :resource-fetcher="fetchDataPlaneProxy"
          :resource-fetcher-watch-key="props.dataPlaneOverview.name"
          code-max-height="250px"
        />
      </div>
    </template>
  </KCard>
</template>

<script lang="ts" setup>
import { KCard, KIcon } from '@kong/kongponents'
import { computed, PropType } from 'vue'

import DefinitionList from '@/app/common/DefinitionList.vue'
import DefinitionListItem from '@/app/common/DefinitionListItem.vue'
import ResourceCodeBlock from '@/app/common/ResourceCodeBlock.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import TagList from '@/app/common/TagList.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import type { SingleResourceParameters } from '@/types/api.d'
import { DataPlaneOverview } from '@/types/index.d'
import { useKumaApi, useI18n } from '@/utilities'
import { dpTags, getStatusAndReason, getVersions } from '@/utilities/dataplane'
import { rawReadableDate } from '@/utilities/helpers'

const kumaApi = useKumaApi()

const { t } = useI18n()

const props = defineProps({
  dataPlaneOverview: {
    type: Object as PropType<DataPlaneOverview>,
    required: true,
  },
})

const detailViewRoute = computed(() => ({
  name: 'data-plane-detail-view',
  params: {
    mesh: props.dataPlaneOverview.mesh,
    dataPlane: props.dataPlaneOverview.name,
  },
}))

const dataPlaneTags = computed(() => dpTags(props.dataPlaneOverview.dataplane))

const subscriptionWrappers = computed(() => {
  const subscriptions = Array.from(props.dataPlaneOverview.dataplaneInsight?.subscriptions ?? [])

  subscriptions.reverse()

  return subscriptions.map((subscription) => {
    const formattedConnectDate = subscription.connectTime !== undefined ? rawReadableDate(subscription.connectTime) : '—'
    const formattedDisconnectDate = subscription.disconnectTime !== undefined ? rawReadableDate(subscription.disconnectTime) : '—'
    const statuses = Object.entries(subscription.status)
      .filter(([prop]) => !['total', 'lastUpdateTime'].includes(prop))
      .map(([prop, stats]) => {
        const ratio = `${stats.responsesAcknowledged ?? 0} / ${stats.responsesSent ?? 0}`

        return {
          type: prop.toUpperCase(),
          ratio,
          responsesSent: stats.responsesSent ?? 0,
          responsesAcknowledged: stats.responsesAcknowledged ?? 0,
          responsesRejected: stats.responsesRejected ?? 0,
        }
      })
    return {
      subscription,
      formattedConnectDate,
      formattedDisconnectDate,
      statuses,
    }
  })
})

const status = computed(() => {
  const { status } = getStatusAndReason(props.dataPlaneOverview.dataplane, props.dataPlaneOverview.dataplaneInsight)

  return status
})

const dependencies = computed(() => {
  const versions = getVersions(props.dataPlaneOverview.dataplaneInsight)

  if (versions !== null) {
    return Object.entries(versions).map(([name, version]) => ({ name, version }))
  } else {
    return []
  }
})

const warnings = computed(() => {
  const subscriptions = props.dataPlaneOverview.dataplaneInsight?.subscriptions ?? []

  if (subscriptions.length === 0) {
    return []
  }

  const latestSubscription = subscriptions[subscriptions.length - 1]

  if (!latestSubscription.version) {
    return []
  }

  const warnings = []
  const envoy = latestSubscription.version.envoy
  const kumaDp = latestSubscription.version.kumaDp
  const isKumaDpCompatible = envoy.kumaDpCompatible !== undefined ? envoy.kumaDpCompatible : true

  if (!isKumaDpCompatible) {
    const warning = `Envoy ${envoy.version} is not supported by Kuma DP ${kumaDp.version}.`
    warnings.push(warning)
  }

  const isKumaCpCompatible = kumaDp.kumaCpCompatible !== undefined ? kumaDp.kumaCpCompatible : true
  if (!isKumaCpCompatible) {
    const warning = `Kuma DP ${kumaDp.version} is not supported by this Kuma control plane.`
    warnings.push(warning)
  }

  return warnings
})

async function fetchDataPlaneProxy(params?: SingleResourceParameters) {
  const { mesh, name } = props.dataPlaneOverview
  return await kumaApi.getDataplaneFromMesh({ mesh, name }, params)
}
</script>

<style lang="scss" scoped>
h3, h4, h5 {
  margin-bottom: var(--spacing-xs);
}

.heading-with-icon {
  display: flex;
  align-items: center;
}

.entity-section-list {
  display: flex;
  flex-wrap: wrap;
  row-gap: var(--spacing-md);
}

.entity-section-list > * {
  flex-basis: max(60ch, 33.333%);
  min-inline-size: 0;
}

.entity-section-list > :not(:last-child) {
  padding-right: var(--spacing-md);
}

.entity-title {
  display: flex;
  gap: var(--spacing-md);
}

.block-list > :not(:first-child) {
  margin-top: var(--spacing-xs);
}
</style>
