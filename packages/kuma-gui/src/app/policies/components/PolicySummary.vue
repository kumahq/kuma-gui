<template>
  <XLayout
    type="stack"
  >
    <slot name="header" />
    <template v-if="props.format === 'structured'">
      <XTable
        data-testid="structured-view"
        variant="kv"
      >
        <tr>
          <th scope="row">
            {{ t('http.api.property.type') }}
          </th>
          <td>
            <XBadge
              v-if="props.policy.type"
              appearance="neutral"
            >
              {{ props.policy.type }}
            </XBadge>
          </td>
        </tr>
        <tr
          v-if="!props.legacy"
        >
          <th scope="row">
            {{ t('http.api.property.targetRef') }}
          </th>
          <td>
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
          </td>
        </tr>
        <tr
          v-if="props.policy.namespace.length > 0"
        >
          <th scope="row">
            {{ t('data-planes.routes.item.namespace') }}
          </th>
          <td>{{ props.policy.namespace }}</td>
        </tr>
        <tr
          v-if="can('use zones') && props.policy.zone"
        >
          <th scope="row">
            Zone
          </th>
          <td>
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
          </td>
        </tr>
      </XTable>
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

const { t } = useI18n()
const can = useCan()

const props = defineProps<{
  policy: Policy
  format: string
  legacy: boolean
}>()
</script>
