<template>
  <div class="policy-list-content">
    <KCard data-testid="policy-type-list">
      <template #body>
        <div
          v-for="(policyTypeWrapper, index) in sortedPolicyTypeWrappers"
          :key="index"
          class="policy-type-link-wrapper"
          :class="{
            'policy-type-link-wrapper--is-active': policyTypeWrapper.policyType.path === props.currentPolicyTypePath,
          }"
        >
          <RouterLink
            class="policy-type-link"
            :to="{
              name: 'policies-list-view',
              params: {
                mesh: route.params.mesh,
                policyPath: policyTypeWrapper.policyType.path,
              },
            }"
            :data-testid="`policy-type-link-${policyTypeWrapper.policyType.name}`"
          >
            {{ policyTypeWrapper.policyType.name }}
          </RouterLink>

          <div class="policy-count">
            {{ policyTypeWrapper.numberOfPolicies }}
          </div>
        </div>
      </template>
    </KCard>

    <KCard class="policy-list">
      <template #body>
        <div class="stack">
          <AppCollection
            class="policy-collection"
            data-testid="policy-collection"
            :empty-state-title="t('common.emptyState.title')"
            :empty-state-message="t('common.emptyState.message', { type: `${policyType.name} policies` })"
            :headers="[
              { label: 'Name', key: 'name' },
              { label: 'Type', key: 'type' },
              { label: 'Actions', key: 'actions', hideLabel: true },
            ]"
            :page-number="props.pageNumber"
            :page-size="props.pageSize"
            :total="props.policyCollection?.total"
            :items="props.policyCollection?.items"
            :error="props.policyError"
            @change="emit('change', $event)"
          >
            <template #toolbar>
              <KBadge
                v-if="policyType.isExperimental"
                appearance="warning"
              >
                {{ t('policies.collection.beta') }}
              </KBadge>

              <DocumentationLink
                :href="t('policies.href.docs', { name: policyType.name })"
                data-testid="policy-documentation-link"
              />
            </template>

            <template #name="{ rowValue }">
              <RouterLink
                :to="{
                  name: 'policy-detail-view',
                  params: {
                    mesh: route.params.mesh,
                    policyPath: policyType.path,
                    policy: rowValue,
                  },
                }"
              >
                {{ rowValue }}
              </RouterLink>
            </template>

            <template #type="{ rowValue }">
              {{ rowValue }}
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
                        color="var(--black-400)"
                        icon="more"
                        size="16"
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
                          policyPath: policyType.path,
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
        </div>
      </template>
    </KCard>
  </div>
</template>

<script lang="ts" setup>
import {
  KBadge,
  KButton,
  KCard,
  KDropdownItem,
  KDropdownMenu,
  KIcon,
} from '@kong/kongponents'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { PolicyCollection } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import DocumentationLink from '@/app/common/DocumentationLink.vue'
import type { MeshInsight, PolicyType } from '@/types/index.d'
import { useI18n } from '@/utilities'

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
  currentPolicyTypePath: string
  policyCollection: PolicyCollection | undefined
  policyError: Error | undefined
  meshInsight: MeshInsight | undefined
}>()

const emit = defineEmits<{
  (event: 'change', value: ChangeValue): void
}>()

const policyType = computed(() => props.policyTypes.find((policyType) => policyType.path === props.currentPolicyTypePath) ?? props.policyTypes[0])

const sortedPolicyTypeWrappers = computed(() => props.policyTypes.map((policyType) => ({
  policyType,
  numberOfPolicies: props.meshInsight?.policies?.[policyType.name]?.total ?? 0,
})))
</script>

<style lang="scss" scoped>
.policy-list-content {
  display: flex;
  gap: var(--AppGap);
}

.policy-type-link-wrapper {
  font-size: 1rem;
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

.actions-dropdown {
  display: inline-block;
}
</style>
