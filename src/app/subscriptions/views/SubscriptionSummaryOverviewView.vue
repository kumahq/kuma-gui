<template>
  <RouteView
    name="subscription-summary-overview-view"
    v-slot="{ t }"
  >
    <AppView>
      <div
        class="stack-with-borders"
      >
        <DefinitionCard
          layout="horizontal"
        >
          <template #title>
            {{ t('subscriptions.routes.item.headers.version') }}
          </template>

          <template #body>
            <template
              v-for="version in [props.data.version?.kumaCp?.version]"
            >
              {{ version ?? '-' }}
            </template>
          </template>
        </DefinitionCard>
        <DefinitionCard
          layout="horizontal"
        >
          <template #title>
            {{ t('subscriptions.routes.item.headers.connected') }}
          </template>

          <template #body>
            {{ t('common.formats.datetime', { value: Date.parse(props.data.connectTime ?? '') }) }}
          </template>
        </DefinitionCard>
        <DefinitionCard
          v-if="props.data.disconnectTime"
          layout="horizontal"
        >
          <template #title>
            {{ t('subscriptions.routes.item.headers.disconnected') }}
          </template>

          <template #body>
            {{ t('common.formats.datetime', { value: Date.parse(props.data.disconnectTime) }) }}
          </template>
        </DefinitionCard>
        <DefinitionCard
          layout="horizontal"
        >
          <template #title>
            {{ t('subscriptions.routes.item.headers.responses') }}
          </template>

          <template #body>
            <template
              v-for="responses in [props.data.status?.total ?? {}]"
            >
              {{ responses.responsesSent }}/{{ responses.responsesAcknowledged }}
            </template>
          </template>
        </DefinitionCard>
        <DefinitionCard
          v-if="props.data.zoneInstanceId"
          layout="horizontal"
        >
          <template #title>
            {{ t('subscriptions.routes.item.headers.zoneInstanceId') }}
          </template>

          <template #body>
            {{ props.data.zoneInstanceId }}
          </template>
        </DefinitionCard>
        <DefinitionCard
          v-if="props.data.globalInstanceId"
          layout="horizontal"
        >
          <template #title>
            {{ t('subscriptions.routes.item.headers.globalInstanceId') }}
          </template>

          <template #body>
            {{ props.data.globalInstanceId }}
          </template>
        </DefinitionCard>
        <DefinitionCard
          layout="horizontal"
        >
          <template #title>
            {{ t('subscriptions.routes.item.headers.id') }}
          </template>

          <template #body>
            {{ props.data.id }}
          </template>
        </DefinitionCard>
      </div>
      <div
        class="mt-8 stack-with-borders"
      >
        <div>
          <slot name="default" />
        </div>
        <DefinitionCard
          class="mt-4"
          layout="horizontal"
        >
          <template #title>
            <strong>
              {{ t('subscriptions.routes.item.headers.type') }}
            </strong>
          </template>

          <template #body>
            {{ t('subscriptions.routes.item.headers.stat') }}
          </template>
        </DefinitionCard>
        <template
          v-for="[key, item] in Object.entries(props.data.status?.stat ?? {})"
          :key="key"
        >
          <DefinitionCard
            layout="horizontal"
          >
            <template #title>
              {{ key }}
            </template>

            <template #body>
              {{ item.responsesSent }}/{{ item.responsesAcknowledged }}
            </template>
          </DefinitionCard>
        </template>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import type { KDSSubscription } from '@/app/zones/data'

const props = defineProps<{
  data: KDSSubscription
}>()
</script>
