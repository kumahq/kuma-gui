<template>
  <XLayout
    type="stack"
  >
    <slot name="header" />
    <template v-if="props.format === 'structured'">
      <div
        class="mt-4 stack-with-borders"
        data-testid="structured-view"
      >
        <DefinitionCard
          layout="horizontal"
        >
          <template #title>
            {{ t('http.api.property.type') }}
          </template>

          <template #body>
            <XBadge
              v-if="props.policy.type"
              appearance="neutral"
            >
              {{ props.policy.type }}
            </XBadge>
          </template>
        </DefinitionCard>
        <DefinitionCard
          v-if="!props.legacy"
          layout="horizontal"
        >
          <template #title>
            {{ t('http.api.property.targetRef') }}
          </template>

          <template #body>
            <XBadge
              v-if="props.policy.spec?.targetRef"
              appearance="neutral"
            >
              {{ props.policy.spec.targetRef.kind }}<span v-if="props.policy.spec.targetRef.name">:<b>{{ props.policy.spec.targetRef.name }}</b></span>
            </XBadge>
            <XBadge
              v-else
              appearance="neutral"
            >
              Mesh
            </XBadge>
          </template>
        </DefinitionCard>
        <DefinitionCard
          v-if="props.policy.namespace.length > 0"
          layout="horizontal"
        >
          <template #title>
            {{ t('data-planes.routes.item.namespace') }}
          </template>

          <template #body>
            {{ props.policy.namespace }}
          </template>
        </DefinitionCard>
        <DefinitionCard
          v-if="can('use zones') && props.policy.zone"
          layout="horizontal"
        >
          <template
            #title
          >
            Zone
          </template>
          <template
            #body
          >
            <XAction
              :to="{
                name: 'zone-cp-detail-view',
                params: {
                  zone: props.policy.zone,
                },
              }"
            >
              {{ props.policy.zone }}
            </XAction>
          </template>
        </DefinitionCard>
      </div>

      <XCodeBlock
        language="yaml"
        :code="YAML.stringify(policy.spec ?
          { spec: policy.spec } :
          {
            ...('sources' in policy ? { sources: policy.sources } : {}),
            ...('destinations' in policy ? { destinations: policy.destinations } : {}),
            ...('selectors' in policy ? { selectors: policy.selectors } : {}),
            ...('conf' in policy ? { conf: policy.conf } : {}),
            ...('routing' in policy ? { routing: policy.routing } : {}),
            ...('tracing' in policy ? { tracing: policy.tracing } : {}),
            ...('metrics' in policy ? { metrics: policy.metrics } : {}),
            ...('logging' in policy ? { logging: policy.logging } : {}),
          },
        )"
      />
    </template>

    <template v-else>
      <div>
        <div class="mt-4">
          <slot />
        </div>
      </div>
    </template>
  </XLayout>
</template>

<script lang="ts" setup>

import type { Policy } from '../data'
import { useI18n, useCan, YAML } from '@/app/application'
import DefinitionCard from '@/app/common/DefinitionCard.vue'

const { t } = useI18n()
const can = useCan()

const props = defineProps<{
  policy: Policy
  format: string
  legacy: boolean
}>()
</script>
