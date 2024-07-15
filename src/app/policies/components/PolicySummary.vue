<template>
  <div
    class="stack"
  >
    <div v-if="props.policy.spec">
      <h3>
        {{ t('policies.routes.item.overview') }}
      </h3>

      <div class="mt-4 stack">
        <DefinitionCard
          layout="horizontal"
        >
          <template #title>
            {{ t('http.api.property.targetRef') }}
          </template>

          <template #body>
            <template v-if="props.policy.spec.targetRef">
              <KBadge appearance="neutral">
                {{ props.policy.spec.targetRef.kind }}<span v-if="props.policy.spec.targetRef.name">:<b>{{ props.policy.spec.targetRef.name }}</b></span>
              </KBadge>
            </template>

            <template v-else>
              {{ t('common.detail.none') }}
            </template>
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
      </div>
    </div>

    <div>
      <h3>
        {{ t('policies.routes.item.config') }}
      </h3>

      <div class="mt-4">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Policy } from '../data'
import { useI18n } from '@/app/application'
import DefinitionCard from '@/app/common/DefinitionCard.vue'

const { t } = useI18n()

const props = defineProps<{
  policy: Policy
}>()
</script>
