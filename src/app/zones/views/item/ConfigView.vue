<template>
  <RouteView
    v-slot="{ t }"
    name="zone-cp-config-view"
    :params="{
      zone: ''
    }"
  >
    <AppView>
      <template
        v-if="props.notifications.length > 0"
        #notifications
      >
        <ul>
          <!-- eslint-disable vue/no-v-html  -->
          <li
            v-for="warning in props.notifications"
            :key="warning.kind"
            :data-testid="`warning-${warning.kind}`"

            v-html="t(`common.warnings.${warning.kind}`, warning.payload)"
          />
          <!-- eslint-enable -->
        </ul>
      </template>

      <template #title>
        <h2>
          <RouteTitle
            :title="t('zone-cps.routes.item.navigation.zone-cp-config-view')"
            :render="true"
          />
        </h2>
      </template>

      <KCard class="mt-4">
        <template #body>
          <template
            v-for="(conf, i) in [getConfig(props.data)]"
            :key="i"
          >
            <CodeBlock
              v-if="conf !== null"
              id="code-block-zone-config"
              language="json"
              :code="conf"
              is-searchable
              query-key="zone-config"
            />

            <KAlert
              v-else
              class="mt-4"
              data-testid="warning-no-subscriptions"
              appearance="warning"
            >
              <template #alertMessage>
                {{ t('zone-cps.detail.no_subscriptions') }}
              </template>
            </KAlert>
          </template>
        </template>
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import CodeBlock from '@/app/common/CodeBlock.vue'
import type { ZoneOverview } from '@/types'

const props = withDefaults(defineProps<{
  data: ZoneOverview
  notifications: { kind: string, payload: Record<string, string> }[]
}>(), {
  notifications: () => [],
})

function getConfig(zoneOverview: ZoneOverview) {
  const subscriptions = zoneOverview.zoneInsight?.subscriptions ?? []
  if (subscriptions.length > 0) {
    const lastSubscription = subscriptions[subscriptions.length - 1]
    if (lastSubscription.config) {
      return JSON.stringify(JSON.parse(lastSubscription.config), null, 2)
    }
  }
  return null
}
</script>
