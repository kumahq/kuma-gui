<template>
  <RouteView
    name="data-plane-subscriptions-summary-view"
    :params="{
      inactive: Boolean,
      mesh: '',
      proxy: '',
      subscription: '',
    }"
    v-slot="{ route, t, me }"
  >
    <AppView>
      <template #title>
        <h2>
          <RouteTitle
            :title="t('data-planes.routes.item.subscriptions.title')"
          />
        </h2>
      </template>

      <XLayout data-testid="dataplane-subscriptions">
        <XI18n path="data-planes.routes.item.subscriptions.description" />
        <AppCollection
          :headers="[
            { ...me.get('headers.connection'), label: '&nbsp;', key: 'connection' },
            { ...me.get('headers.instanceId'), label: t('http.api.property.instanceId'), key: 'instanceId' },
            { ...me.get('headers.version'), label: t('http.api.property.version'), key: 'version' },
            { ...me.get('headers.connected'), label: t('http.api.property.connected'), key: 'connected' },
            { ...me.get('headers.disconnected'), label: t('http.api.property.disconnected'), key: 'disconnected' },
            { ...me.get('headers.responses'), label: t('http.api.property.responses'), key: 'responses' },
          ]"
          :is-selected-row="item => item.id === route.params.subscription"
          :items="[...props.subscriptions].reverse()"
          @resize="me.set"
        >
          <template
            #connection="{ row: item }"
          >
            <template
              v-for="connection in [item.connectTime && !item.disconnectTime ? 'healthy' : 'unhealthy'] as const"
              :key="`${connection}`"
            >
              <XIcon :name="connection">
                {{ t(`common.connection.${connection}`) }}
              </XIcon>
            </template>
          </template>
          <template
            #instanceId="{ row: item }"
          >
            <XAction
              data-action
              :to="{
                name: 'data-plane-subscription-summary-view',
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
      </XLayout>
    </AppView>


    <RouterView
      v-slot="child"
    >
      <XDrawer
        v-if="child.route.name !== route.name"
        width="670px"
        @close="function () {
          route.replace({
            name: 'data-plane-subscriptions-summary-view',
            params: {
              mesh: route.params.mesh,
              proxy: route.params.proxy,
            },
            query: {
              inactive: route.params.inactive ? null : undefined,
            },
          })

        }"
      >
        <component
          :is="child.Component"
          :data="props.subscriptions"
        />
      </XDrawer>
    </RouterView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { DataplaneOverview } from '../data'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
const props = defineProps<{
  subscriptions: DataplaneOverview['dataplaneInsight']['subscriptions']
}>()
</script>

<style scoped>
h2 {
  --icon-before: url('@/assets/images/subscriptions.svg?inline') !important;
}
</style>
