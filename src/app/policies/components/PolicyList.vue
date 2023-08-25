<template>
  <div class="policy-list-content">
    <KCard
      class="policy-type-list"
      data-testid="policy-type-list"
    >
      <template #body>
        <div
          v-for="(policyType, index) in props.policyTypes"
          :key="index"
          class="policy-type-link-wrapper"
          :class="{
            'policy-type-link-wrapper--is-active': policyType.path === props.currentPolicyType.path,
          }"
        >
          <RouterLink
            class="policy-type-link"
            :to="{
              name: 'policies-list-view',
              params: {
                mesh: route.params.mesh,
                policyPath: policyType.path,
              },
            }"
            :data-testid="`policy-type-link-${policyType.name}`"
          >
            {{ policyType.name }}
          </RouterLink>

          <div class="policy-count">
            {{ props.meshInsight?.policies?.[policyType.name]?.total ?? 0 }}
          </div>
        </div>
      </template>
    </KCard>

    <div class="policy-list">
      <div class="stack">
        <KCard>
          <template #body>
            <div class="description">
              <div class="description-content">
                <h3>
                  <PolicyTypeTag :policy-type="props.currentPolicyType.name">
                    {{ t('policies.collection.title', { name: props.currentPolicyType.name }) }}
                  </PolicyTypeTag>
                </h3>

                <p>{{ t('policies.collection.description') }}</p>
              </div>

              <div class="description-actions">
                <KBadge
                  v-if="props.currentPolicyType.isExperimental"
                  appearance="warning"
                >
                  {{ t('policies.collection.beta') }}
                </KBadge>

                <KBadge
                  v-if="props.currentPolicyType.isInbound"
                  appearance="neutral"
                >
                  {{ t('policies.collection.inbound') }}
                </KBadge>

                <KBadge
                  v-if="props.currentPolicyType.isOutbound"
                  appearance="neutral"
                >
                  {{ t('policies.collection.outbound') }}
                </KBadge>

                <DocumentationLink
                  :href="t('policies.href.docs', { name: props.currentPolicyType.name })"
                  data-testid="policy-documentation-link"
                >
                  <span class="visually-hidden">{{ t('common.documentation') }}</span>
                </DocumentationLink>
              </div>
            </div>
          </template>
        </KCard>

        <KCard>
          <template #body>
            <AppCollection
              class="policy-collection"
              data-testid="policy-collection"
              :empty-state-message="t('common.emptyState.message', { type: `${props.currentPolicyType.name} policies` })"
              :empty-state-cta-to="t('policies.href.docs', { name: props.currentPolicyType.name })"
              :empty-state-cta-text="t('common.documentation')"
              :headers="[
                { label: 'Name', key: 'name' },
                props.currentPolicyType.isTargetRefBased ? { label: 'Target ref', key: 'targetRef' } : undefined,
                { label: 'Actions', key: 'actions', hideLabel: true },
              ].filter(notEmpty)"
              :page-number="props.pageNumber"
              :page-size="props.pageSize"
              :total="props.policyCollection?.total"
              :items="props.policyCollection?.items"
              :error="props.policyError"
              @change="emit('change', $event)"
            >
              <template #name="{ rowValue }">
                <RouterLink
                  :to="{
                    name: 'policy-detail-view',
                    params: {
                      mesh: route.params.mesh,
                      policyPath: props.currentPolicyType.path,
                      policy: rowValue,
                    },
                  }"
                >
                  {{ rowValue }}
                </RouterLink>
              </template>

              <template #targetRef="{ row }">
                <template v-if="props.currentPolicyType.isTargetRefBased">
                  <KBadge appearance="neutral">
                    {{ row.spec.targetRef.kind }}<span v-if="row.spec.targetRef.name">:<b>{{ row.spec.targetRef.name }}</b>
                    </span>
                  </KBadge>
                </template>

                <template v-else>
                  {{ t('common.detail.none') }}
                </template>
              </template>

              <template #actions="{ row }">
                <KDropdownMenu
                  class="actions-dropdown"
                  :kpop-attributes="{ placement: 'bottomEnd', popoverClasses: 'mt-5 more-actions-popover' }"
                  width="150"
                >
                  <template #default>
                    <KButton
                      class="non-visual-button"
                      appearance="secondary"
                      size="small"
                    >
                      <template #icon>
                        <KIcon
                          :color="KUI_COLOR_TEXT_NEUTRAL_STRONGER"
                          icon="more"
                          :size="KUI_ICON_SIZE_30"
                        />
                      </template>
                    </KButton>
                  </template>

                  <template #items>
                    <KDropdownItem
                      :item="{
                        to: {
                          name: 'policy-detail-view',
                          params: {
                            mesh: route.params.mesh,
                            policyPath: props.currentPolicyType.path,
                            policy: row.name,
                          },
                        },
                        label: t('common.collection.actions.view'),
                      }"
                    />
                  </template>
                </KDropdownMenu>
              </template>
            </AppCollection>
          </template>
        </KCard>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { KUI_COLOR_TEXT_NEUTRAL_STRONGER, KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import {
  KBadge,
  KButton,
  KCard,
  KDropdownItem,
  KDropdownMenu,
  KIcon,
} from '@kong/kongponents'
import { useRoute } from 'vue-router'

import { PolicyCollection } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import DocumentationLink from '@/app/common/DocumentationLink.vue'
import PolicyTypeTag from '@/app/common/PolicyTypeTag.vue'
import type { MeshInsight, PolicyType } from '@/types/index.d'
import { useI18n } from '@/utilities'
import { notEmpty } from '@/utilities/notEmpty'

type ChangeValue = {
  page: number
  size: number
  s: string
}

const { t } = useI18n()
const route = useRoute()

const props = defineProps<{
  pageNumber: number
  pageSize: number
  policyTypes: PolicyType[]
  currentPolicyType: PolicyType
  policyCollection: PolicyCollection | undefined
  policyError: Error | undefined
  meshInsight: MeshInsight | undefined
}>()

const emit = defineEmits<{
  (event: 'change', value: ChangeValue): void
}>()
</script>

<style lang="scss" scoped>
.policy-list-content {
  display: flex;
  gap: var(--AppGap);
}

.policy-type-list {
  align-self: flex-start;
}

.policy-type-link-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: $kui-space-60;
}

.policy-type-link-wrapper--is-active {
  background-color: $kui-color-background-primary-weakest;
}

.policy-type-link-wrapper:not(.policy-type-link-wrapper--is-active) {
  color: $kui-color-text-neutral;
}

.policy-type-link {
  color: currentColor;
  flex-grow: 1;
  padding: $kui-space-40 $kui-space-60;
}

.policy-count {
  text-align: right;
  padding-right: $kui-space-60;
}

.policy-list {
  flex-grow: 1;
}

.description {
  display: flex;
  gap: $kui-space-60;
}

.description-content {
  flex-grow: 1;
}

.description-actions {
  display: flex;
  align-items: flex-start;
  gap: $kui-space-40;
}

.actions-dropdown {
  display: inline-block;
}
</style>
