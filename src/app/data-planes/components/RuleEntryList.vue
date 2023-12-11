<template>
  <AccordionList
    :initially-open="[]"
    multiple-open
  >
    <AccordionItem
      v-for="(ruleEntry, index) in props.ruleEntries"
      :key="index"
    >
      <template #accordion-header>
        <h3 class="policy-type-heading">
          <PolicyTypeTag :policy-type="ruleEntry.type">
            {{ ruleEntry.type }}
          </PolicyTypeTag>
        </h3>
      </template>

      <template #accordion-content>
        <div class="policy-list">
          <KTable
            class="policy-type-table"
            :class="{
              'has-matchers': props.showMatchers,
            }"
            :fetcher="() => ({ data: ruleEntry.rules, total: ruleEntry.rules.length })"
            :headers="[
              ...(props.showMatchers ? [{ label: 'Matchers', key: 'matchers' }] : []),
              { label: 'Origin policies', key: 'origins' },
              { label: 'Conf', key: 'config' },
            ]"
            :cell-attrs="getCellAttributes"
            disable-pagination
          >
            <template
              v-if="props.showMatchers"
              #matchers="{ row }: { row: RuleEntryRule }"
            >
              <span
                v-if="row.matchers && row.matchers.length > 0"
                class="matcher"
              >
                <template
                  v-for="({ key, value, not }, matcherIndex) in row.matchers"
                  :key="matcherIndex"
                >
                  <span
                    v-if="matcherIndex > 0"
                    class="matcher__and"
                  > and<br></span><span
                    v-if="not"
                    class="matcher__not"
                  >!</span><span class="matcher__term">{{ `${key}:${value}` }}</span>
                </template>
              </span>

              <template v-else>
                <i>{{ t('data-planes.routes.item.matches_everything') }}</i>
              </template>
            </template>

            <template #origins="{ row }: { row: RuleEntryRule }">
              <ul v-if="row.origins.length > 0">
                <li
                  v-for="(origin, originIndex) in row.origins"
                  :key="`${index}-${originIndex}`"
                >
                  <RouterLink :to="origin.route">
                    {{ origin.name }}
                  </RouterLink>
                </li>
              </ul>

              <template v-else>
                {{ t('common.collection.none') }}
              </template>
            </template>

            <template #config="{ row, rowKey }: { row: RuleEntryRule, rowKey: number }">
              <template v-if="row.config !== undefined">
                <CodeBlock
                  :id="`${props.id}-${index}-${rowKey}-code-block`"
                  :code="row.config"
                  language="yaml"
                  :show-copy-button="false"
                />
              </template>

              <template v-else>
                {{ t('common.collection.none') }}
              </template>
            </template>
          </KTable>
        </div>
      </template>
    </AccordionItem>
  </AccordionList>
</template>

<script lang="ts" setup>
import { useI18n } from '@/app/application'
import AccordionItem from '@/app/common/AccordionItem.vue'
import AccordionList from '@/app/common/AccordionList.vue'
import CodeBlock from '@/app/common/CodeBlock.vue'
import PolicyTypeTag from '@/app/common/PolicyTypeTag.vue'
import type { InspectRuleMatcher } from '@/types/index.d'
import type { RouteLocationNamedRaw } from 'vue-router'

export type RuleEntryRule = {
  config: string | undefined
  matchers?: InspectRuleMatcher[]
  origins: Array<{ name: string, route: RouteLocationNamedRaw }>
}

export type RuleEntry = {
  type: string
  rules: RuleEntryRule[]
}

const { t } = useI18n()

const props = withDefaults(defineProps<{
  id: string
  ruleEntries: RuleEntry[]
  showMatchers?: boolean
}>(), {
  showMatchers: true,
})

function getCellAttributes({ headerKey }: any): Record<string, string> {
  return { class: `cell-${headerKey}` }
}
</script>

<style lang="scss" scoped>
.policy-type-heading {
  font-size: inherit;
  font-weight: $kui-font-weight-regular;
}

.policy-list {
  display: flex;
  flex-direction: column;
  gap: $kui-space-40;
}

.policy-type-table {
  :deep(table){
    table-layout: fixed;
  }

  :deep(td) {
    vertical-align: top;
  }

  &:not(.has-matchers) {
    :deep(th:nth-child(1)),
    :deep(td:nth-child(1)) {
      width: 65%;
    }

    :deep(th:nth-child(2)),
    :deep(td:nth-child(2)) {
      width: 35%;
    }
  }

  &.has-matchers {
    :deep(th:nth-child(1)),
    :deep(td:nth-child(1)) {
      width: 50%;
    }

    :deep(th:nth-child(2)),
    :deep(td:nth-child(2)) {
      width: 15%;
    }

    :deep(th:nth-child(3)),
    :deep(td:nth-child(3)) {
      width: 35%;
    }
  }
}

.matcher {
  white-space: normal;
  word-break: break-word;
}

.matcher__not {
  color: $kui-color-text-danger;
}

.matcher__and {
  font-weight: $kui-font-weight-semibold;
}

.matcher__not,
.matcher__term {
  font-family: $kui-font-family-code;
}
</style>
