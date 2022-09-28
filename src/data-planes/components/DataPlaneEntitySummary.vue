<template>
  <div class="entity-summary entity-section-list">
    <section>
      <h3 class="entity-title">
        <span class="kutil-sr-only">Data plane:</span>

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

        <div
          :class="`status status--${status.appearance}`"
          data-testid="data-plane-status-badge"
        >
          {{ status.title.toLowerCase() }}
        </div>
      </h3>

      <div class="definition">
        <span>Mesh:</span>
        <span>{{ dataPlaneOverview.mesh }}</span>
      </div>
    </section>

    <section v-if="dataPlaneTags.length > 0">
      <h4>Tags</h4>

      <div class="tag-list">
        <EntityTag
          v-for="(tag, index) in dataPlaneTags"
          :key="index"
          :tag="tag"
        />
      </div>
    </section>

    <section v-if="dependencies.length > 0">
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
    </section>

    <template v-if="subscriptionWrappers.length > 0">
      <section>
        <h4>Insights</h4>

        <div class="entity-section-list">
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
              <span>Control plane instance ID:</span>
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

      <section>
        <YamlView :content="dataPlane" />
      </section>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue'
import { KIcon } from '@kong/kongponents'

import { DataPlaneOverview, DataPlaneStatus } from '@/types'
import { STATUS } from '@/consts'
import { rawReadableDate } from '@/helpers'
import EntityTag from '@/components/EntityTag/EntityTag.vue'
import YamlView from '@/components/Skeletons/YamlView.vue'
import { dpTags, getStatus, getVersions } from '@/dataplane'

const props = defineProps({
  dataPlaneOverview: {
    type: Object as PropType<DataPlaneOverview>,
    required: true,
  },
})

const STATUS_KEYWORD: Record<DataPlaneStatus, string> = {
  'Partially degraded': 'partially_degraded',
  Offline: 'offline',
  Online: 'online',
}

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
  const subscriptions = Array.from(props.dataPlaneOverview.dataplaneInsight.subscriptions)

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
  const { status: title } = getStatus(props.dataPlaneOverview.dataplane, props.dataPlaneOverview.dataplaneInsight)

  return STATUS[STATUS_KEYWORD[title]]
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
  const { subscriptions } = props.dataPlaneOverview.dataplaneInsight

  if (subscriptions.length === 0) {
    return []
  }

  const warnings = []
  const latestSubscription = subscriptions[subscriptions.length - 1]

  const envoy = latestSubscription.version.envoy
  const kumaDp = latestSubscription.version.kumaDp

  const isKumaDpCompatible = envoy.kumaDpCompatible !== undefined ? envoy.kumaDpCompatible : true
  const isKumaCpCompatible = kumaDp.kumaCpCompatible !== undefined ? kumaDp.kumaCpCompatible : true

  if (!isKumaDpCompatible) {
    const warning = `Envoy ${envoy.version} is not supported by Kuma DP ${kumaDp.version}.`
    warnings.push(warning)
  }

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
  flex: 1 1 60ch;
  flex-wrap: wrap;
  gap: var(--spacing-md) var(--spacing-xl);
}

.entity-section-list > * {
  min-inline-size: 0;
  flex-grow: 1;
}

.entity-title {
  display: flex;
  gap: var(--spacing-md);
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xxs);
}

.definition {
  display: grid;
  grid-template-columns: 22ch 1fr;
  grid-gap: var(--spacing-md);
}

.status::before {
  content: '';
  display: inline-block;
  vertical-align: middle;
  margin-right: var(--spacing-xs);
  border: 4px solid currentColor;
  border-radius: 50%;
}

.status--success {
  color: var(--green-400);
}

.status--warning {
  color: var(--yellow-500);
}

.status--danger {
  color:  var(--red-600);
}
</style>
