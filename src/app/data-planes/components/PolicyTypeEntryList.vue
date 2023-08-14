<template>
  <AccordionList
    :initially-open="[]"
    multiple-open
  >
    <AccordionItem
      v-for="(policyTypeEntry, index) in props.policyTypeEntries"
      :key="index"
    >
      <template #accordion-header>
        <h3 class="policy-type-heading">
          <PolicyTypeTag :policy-type="policyTypeEntry.type">
            {{ policyTypeEntry.type }} ({{ policyTypeEntry.connections.length }})
          </PolicyTypeTag>
        </h3>
      </template>

      <template #accordion-content>
        <div class="policy-list">
          <KTable
            class="policy-type-table"
            :fetcher="() => ({ data: policyTypeEntry.connections, total: policyTypeEntry.connections.length })"
            :headers="tableHeaders"
            :cell-attrs="getCellAttributes"
            disable-pagination
            is-clickable
          >
            <template #sourceTags="{ rowValue }">
              <TagList
                v-if="rowValue.length > 0"
                class="tag-list"
                :tags="rowValue"
              />

              <template v-else>
                —
              </template>
            </template>

            <template #destinationTags="{ rowValue }">
              <TagList
                v-if="rowValue.length > 0"
                class="tag-list"
                :tags="rowValue"
              />

              <template v-else>
                —
              </template>
            </template>

            <template #name="{ rowValue }">
              <template v-if="rowValue !== null">
                {{ rowValue }}
              </template>

              <template v-else>
                —
              </template>
            </template>

            <template #origins="{ rowValue }">
              <ul v-if="rowValue.length > 0">
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
import { PolicyTypeEntry, TableHeader } from '@/types/index'

const tableHeaders: TableHeader[] = [
  { label: 'From', key: 'sourceTags' },
  { label: 'To', key: 'destinationTags' },
  { label: 'On', key: 'name' },
  { label: 'Conf', key: 'config' },
  { label: 'Origin policies', key: 'origins' },
]

const props = defineProps({
  id: {
    type: String,
    required: false,
    default: 'entry-list',
  },

  policyTypeEntries: {
    type: Object as PropType<PolicyTypeEntry[]>,
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

.tag-list {
  display: flex;
  margin-top: var(--spacing-xxs);
}
</style>

<style lang="scss">
.policy-type-table.policy-type-table td {
  vertical-align: top;
}

.cell-sourceTags { width: 15%; }
.cell-destinationTags { width: 20%; }
.cell-name { width: 15%; }
.cell-config { width: 35%; }
.cell-origins { width: 15%; }
</style>
