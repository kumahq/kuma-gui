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
            {{ ruleEntry.type }} ({{ ruleEntry.connections.length }})
          </PolicyTypeTag>
        </h3>
      </template>

      <template #accordion-content>
        <div class="policy-list">
          <KTable
            class="policy-type-table"
            :fetcher="() => ({ data: ruleEntry.connections, total: ruleEntry.connections.length })"
            :headers="tableHeaders"
            :cell-attrs="getCellAttributes"
            disable-pagination
            is-clickable
          >
            <template #type="{ rowValue }">
              <template v-if="rowValue.sourceTags.length === 0 && rowValue.destinationTags.length === 0">
                —
              </template>

              <div
                v-else
                class="tag-list-wrapper"
              >
                <div v-if="rowValue.sourceTags.length > 0">
                  From

                  <TagList
                    class="tag-list"
                    :tags="rowValue.sourceTags"
                  />
                </div>

                <div v-if="rowValue.destinationTags.length > 0">
                  To

                  <TagList
                    class="tag-list"
                    :tags="rowValue.destinationTags"
                  />
                </div>
              </div>
            </template>

            <template #addresses="{ rowValue }">
              <ul
                v-if="rowValue.length > 0"
                class="list"
              >
                <li
                  v-for="(address, addressIndex) in rowValue"
                  :key="`${index}-${addressIndex}`"
                >
                  {{ address }}
                </li>
              </ul>

              <template v-else>
                —
              </template>
            </template>

            <template #origins="{ rowValue }">
              <ul
                v-if="rowValue.length > 0"
                class="list"
              >
                <li
                  v-for="(origin, originIndex) in rowValue"
                  :key="`${index}-${originIndex}`"
                >
                  <router-link :to="origin.route">
                    {{ origin.name }}
                  </router-link>
                </li>
              </ul>

              <template v-else>
                —
              </template>
            </template>

            <template #config="{ rowValue, rowKey }">
              <template v-if="rowValue !== null">
                <CodeBlock
                  :id="`${props.id}-${index}-${rowKey}-code-block`"
                  :code="rowValue"
                  language="yaml"
                  :show-copy-button="false"
                />
              </template>

              <template v-else>
                —
              </template>
            </template>
          </KTable>
        </div>
      </template>
    </AccordionItem>
  </AccordionList>
</template>

<script lang="ts" setup>
import { KTable } from '@kong/kongponents'
import { PropType } from 'vue'

import AccordionItem from '@/app/common/AccordionItem.vue'
import AccordionList from '@/app/common/AccordionList.vue'
import CodeBlock from '@/app/common/CodeBlock.vue'
import PolicyTypeTag from '@/app/common/PolicyTypeTag.vue'
import TagList from '@/app/common/TagList.vue'
import { RuleEntry, TableHeader } from '@/types/index'

const tableHeaders: TableHeader[] = [
  { label: 'Type', key: 'type' },
  { label: 'Addresses', key: 'addresses' },
  { label: 'Conf', key: 'config' },
  { label: 'Origin policies', key: 'origins' },
]

const props = defineProps({
  id: {
    type: String,
    required: false,
    default: 'entry-list',
  },

  ruleEntries: {
    type: Object as PropType<RuleEntry[]>,
    required: true,
  },
})

function getCellAttributes({ headerKey }: any): Record<string, string> {
  return { class: `cell-${headerKey}` }
}
</script>

<style lang="scss" scoped>
.policy-type-heading {
  font-size: inherit;
  font-weight: var(--font-weight-regular);
}

.policy-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.tag-list-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.tag-list {
  display: flex;
  margin-top: var(--spacing-xxs);
}

.list {
  list-style: initial;
  padding-left: var(--spacing-md);
}
</style>

<style lang="scss">
.policy-type-table.policy-type-table td {
  vertical-align: top;
}

.cell-type { width: 35%; }
.cell-name { width: 15%; }
.cell-config { width: 35%; }
.cell-origins { width: 15%; }
</style>
