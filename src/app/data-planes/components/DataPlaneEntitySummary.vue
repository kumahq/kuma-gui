<template>
  <div class="entity-summary entity-section-list">
    <section>
      <div class="block-list">
        <div>
          <h3
            class="entity-title"
            data-testid="data-plane-proxy-title"
          >
            <span>
              DPP:

              <router-link
                :to="{
                  name: 'data-plane-detail-view',
                  params: {
                    mesh: dataPlaneOverview.mesh,
                    dataPlane: dataPlaneOverview.name,
                  },
                }"
              >
                {{ dataPlaneOverview.name }}
              </router-link>
            </span>

            <StatusBadge :status="status" />
          </h3>

          <div class="definition">
            <span>Mesh:</span>
            <span>{{ dataPlaneOverview.mesh }}</span>
          </div>
        </div>

        <div v-if="dataPlaneTags.length > 0">
          <h4>Tags</h4>

          <TagList :tags="dataPlaneTags" />
        </div>

        <div v-if="dependencies.length > 0">
          <h4>Dependencies</h4>

          <div
            v-for="(dependency, index) in dependencies"
            :key="index"
            class="definition"
          >
            <span>{{ dependency.name }}:</span>
            <span>{{ dependency.version }}</span>
          </div>

          <template v-if="warnings.length > 0">
            <h5 class="mt-2 heading-with-icon">
              Warnings

              <KIcon
                class="ml-1"
                icon="warning"
                color="var(--black-75)"
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
        </div>
      </div>
    </section>

    <section v-if="subscriptionWrappers.length > 0">
      <h4>Insights</h4>

      <div class="block-list">
        <div
          v-for="(subscriptionWrapper, index) in subscriptionWrappers"
          :key="index"
        >
          <div
            class="definition"
            :data-testid="`data-plane-connect-time-${index}`"
          >
            <span>Connect time:</span>
            <span>{{ subscriptionWrapper.formattedConnectDate }}</span>
          </div>

          <div
            class="definition"
            :data-testid="`data-plane-disconnect-time-${index}`"
          >
            <span>Disconnect time:</span>
            <span>{{ subscriptionWrapper.formattedDisconnectDate }}</span>
          </div>

          <div class="definition">
            <span>CP instance ID:</span>
            <span>{{ subscriptionWrapper.subscription.controlPlaneInstanceId }}</span>
          </div>

          <details v-if="subscriptionWrapper.statuses.length > 0">
            <summary>
              Responses (acknowledged / sent)
            </summary>

            <div
              v-for="(subscriptionStatus, subscriptionStatusIndex) in subscriptionWrapper.statuses"
              :key="`${index}-${subscriptionStatusIndex}`"
              class="definition"
              :data-testid="`data-plane-subscription-status-${index}-${subscriptionStatusIndex}`"
            >
              <span>{{ subscriptionStatus.type }}:</span>
              <span>{{ subscriptionStatus.ratio }}</span>
            </div>
          </details>
        </div>
      </div>
    </section>

    <section class="config-section">
      <YamlView
        id="code-block-data-plane-summary"
        :content="dataPlane"
        code-max-height="250px"
      />
    </section>
  </div>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue'
import { KIcon } from '@kong/kongponents'

import { DataPlaneOverview } from '@/types/index.d'
import { rawReadableDate } from '@/utilities/helpers'
import TagList from '@/app/common/TagList.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import YamlView from '@/app/common/YamlView.vue'
import { dpTags, getStatusAndReason, getVersions } from '@/utilities/dataplane'

const props = defineProps({
  dataPlaneOverview: {
    type: Object as PropType<DataPlaneOverview>,
    required: true,
  },
})

const dataPlane = computed(() => {
  const { name, mesh, dataplane } = props.dataPlaneOverview

  return {
    type: 'Dataplane',
    name,
    mesh,
    networking: dataplane.networking,
  }
})

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
</script>

<style lang="scss" scoped>
h3, h4, h5 {
  margin-bottom: var(--spacing-xs);
}

h3 {
  font-size: 1.4em;
}

h4 {
  font-size: 1.25em;
}

h5 {
  font-size: 1.1em;
}

.heading-with-icon {
  display: flex;
  align-items: center;
}

.entity-summary {
  padding: var(--spacing-md);
}

.entity-section-list {
  display: flex;
  flex-wrap: wrap;
  row-gap: var(--spacing-md);
}

.entity-section-list > * {
  flex-basis: max(40ch, 33.333%);
  min-inline-size: 0;
}

.entity-section-list > :not(:last-child) {
  padding-right: var(--spacing-md);
}

.config-section {
  max-width: 80ch;
}

.entity-title {
  display: flex;
  gap: var(--spacing-md);
}

.block-list > :not(:first-child) {
  margin-top: var(--spacing-xs);
}

.definition {
  display: grid;
  grid-template-columns: 16ch 1fr;
  grid-gap: var(--spacing-md);
}
</style>
