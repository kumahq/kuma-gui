<template>
  <RouteView
    :name="props.routeName"
    :params="{
      subscription: '',
    }"
    v-slot="{ route, me }"
  >
    <XI18n
      :prefix="props.i18nPrefix"
      v-slot="{ t }"
    >
      <AppView>
        <RouteTitle
          :render="false"
          :title="t('.routes.item.subscriptions.title')"
        />

        <XCard data-testid="subscriptions-listing">
          <XLayout type="stack">
            <XI18n
              :prefix="props.i18nPrefix"
              path=".routes.item.subscriptions.description"
            />
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
                    name: `${props.routePrefix}-subscription-summary-view`,
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
        </XCard>
      </AppView>


      <RouterView
        v-slot="child"
      >
        <XDrawer
          v-if="child.route.name !== route.name"
          width="670px"
          @close="function () {
            route.replace({
              name: props.routeName,
            })
          }"
        >
          <component
            :is="child.Component"
            :data="props.subscriptions"
          />
        </XDrawer>
      </RouterView>
    </XI18n>
  </RouteView>
</template>

<script lang="ts" setup>
import type { Subscription } from '../data'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
const props = defineProps<{
  routeName: string
  routePrefix: string
  i18nPrefix: string
  subscriptions: Subscription[]
}>()
</script>
