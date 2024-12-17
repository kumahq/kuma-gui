<template>
  <RouteView
    name="zone-egress-detail-view"
    :params="{
      subscription: '',
      zoneEgress: '',
    }"
    v-slot="{ t, route, me }"
  >
    <AppView>
      <XLayout type="stack">
        <XAboutSection
          :title="t('zone-egresses.routes.item.about.title')"
          :created="props.data.creationTime"
          :modified="props.data.modificationTime"
        >
          <DefinitionCard layout="horizontal">
            <template #title>
              {{ t('http.api.property.status') }}
            </template>

            <template #body>
              <StatusBadge :status="props.data.state" />
            </template>
          </DefinitionCard>

          <DefinitionCard
            v-if="props.data.namespace.length > 0"
            layout="horizontal"
          >
            <template #title>
              {{ t('http.api.property.namespace') }}
            </template>

            <template #body>
              <XBadge appearance="decorative">
                {{ props.data.namespace }}
              </XBadge>
            </template>
          </DefinitionCard>

          <DefinitionCard layout="horizontal">
            <template #title>
              {{ t('http.api.property.address') }}
            </template>

            <template #body>
              <XCopyButton
                v-if="props.data.zoneEgress.socketAddress.length > 0"
                variant="badge"
                format="default"
                :text="props.data.zoneEgress.socketAddress"
              />

              <template v-else>
                {{ t('common.detail.none') }}
              </template>
            </template>
          </DefinitionCard>
        </XAboutSection>

        <div
          v-if="props.data.zoneEgressInsight.subscriptions.length > 0"
        >
          <h2>{{ t('zone-egresses.routes.item.subscriptions.title') }}</h2>
          <AppCollection
            :headers="[
              { ...me.get('headers.instanceId'), label: t('http.api.property.instanceId'), key: 'instanceId' },
              { ...me.get('headers.version'), label: t('http.api.property.version'), key: 'version' },
              { ...me.get('headers.connected'), label: t('http.api.property.connected'), key: 'connected' },
              { ...me.get('headers.disconnected'), label: t('http.api.property.disconnected'), key: 'disconnected' },
              { ...me.get('headers.responses'), label: t('http.api.property.responses'), key: 'responses' },
            ]"
            :is-selected-row="item => item.id === route.params.subscription"
            :items="props.data.zoneEgressInsight.subscriptions.map((_, i, arr) => arr[arr.length - (i + 1)])"
            @resize="me.set"
          >
            <template
              #instanceId="{ row: item }"
            >
              <XAction
                data-action
                :to="{
                  name: 'zone-egress-subscription-summary-view',
                  params: {
                    subscription: item.id,
                  },
                }"
              >
                {{ item.controlPlaneInstanceId }}
              </XAction>
            </template>
            <template
              #version="{ row: item }"
            >
              {{ item.version?.kumaDp?.version ?? '-' }}
            </template>
            <template
              #connected="{ row: item }"
            >
              {{ t('common.formats.datetime', { value: Date.parse(item.connectTime ?? '') }) }}
            </template>
            <template
              #disconnected="{ row: item }"
            >
              <template
                v-if="item.disconnectTime"
              >
                {{ t('common.formats.datetime', { value: Date.parse(item.disconnectTime) }) }}
              </template>
            </template>
            <template
              #responses="{ row: item }"
            >
              <template
                v-for="responses in [item.status?.total ?? {}]"
              >
                {{ responses.responsesSent }}/{{ responses.responsesAcknowledged }}
              </template>
            </template>
          </AppCollection>
          <RouterView
            v-slot="{ Component }"
          >
            <SummaryView
              v-if="route.child()"
              width="670px"
              @close="function () {
                route.replace({
                  name: 'zone-egress-detail-view',
                  params: {
                    zoneEgress: route.params.zoneEgress,
                  },
                })
              }"
            >
              <component
                :is="Component"
                :data="props.data.zoneEgressInsight.subscriptions"
              />
            </SummaryView>
          </RouterView>
        </div>
      </XLayout>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { ZoneEgressOverview } from '../data'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import SummaryView from '@/app/common/SummaryView.vue'

const props = defineProps<{
  data: ZoneEgressOverview
}>()
</script>
