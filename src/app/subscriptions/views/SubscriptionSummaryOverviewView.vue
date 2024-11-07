<template>
  <RouteView
    :name="$routeName!"
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
            {{ t('http.api.property.version') }}
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
            {{ t('http.api.property.connectTime') }}
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
            {{ t('http.api.property.disconnectTime') }}
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
        <template
          v-for="prop in (['zoneInstanceId', 'globalInstanceId', 'controlPlaneInstanceId'] as const)"
          :key="typeof prop"
        >
          <DefinitionCard
            v-if="props.data[prop]"
            layout="horizontal"
          >
            <template #title>
              {{ t(`http.api.property.${prop}`) }}
            </template>

            <template #body>
              {{ props.data[prop] }}
            </template>
          </DefinitionCard>
        </template>
        <DefinitionCard
          layout="horizontal"
        >
          <template #title>
            {{ t('http.api.property.id') }}
          </template>

          <template #body>
            {{ props.data.id }}
          </template>
        </DefinitionCard>
      </div>
      <XAlert
        v-if="Object.keys(props.data.status.acknowledgements).length === 0"
        appearance="info"
      >
        <template #icon>
          <PortalIcon />
        </template>

        {{ t('common.detail.subscriptions.no_stats', { id: props.data.id }) }}
      </XAlert>
      <div
        v-else
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
          v-for="[key, item] in Object.entries(props.data.status.acknowledgements ?? {})"
          :key="key"
        >
          <DefinitionCard
            layout="horizontal"
          >
            <template #title>
              {{ t(`http.api.property.${key}`) }}
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
import { PortalIcon } from '@kong/icons'

import type { Subscription } from '../data'
import DefinitionCard from '@/app/common/DefinitionCard.vue'

const props = defineProps<{
  data: Subscription
}>()
</script>
